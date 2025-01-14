from flask import Flask, request, jsonify
import google.generativeai as genai
from google.generativeai.types import content_types
from flask_cors import CORS
import PyPDF2
import requests
import base64
import os
import io
from dotenv import load_dotenv
import fitz # PyMuPDF
from PIL import Image  # For image handling

app = Flask(__name__)
CORS(app, origins=['http://127.0.0.1:3000', 'http://localhost:3000']) # Allow app origins


# Load environment variables
load_dotenv()
genai_api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=genai_api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

extracted_context = ""
extracted_images = ["Although the following images are included separately, they also appear inside the report: "]
is_context_ready = False

def extract_text_from_pdf(pdf_stream):
    """Extract text from a PDF file."""
    pdf_reader = PyPDF2.PdfReader(pdf_stream)
    extracted_text = ""
    for page in pdf_reader.pages:
        text = page.extract_text()
        if text:
            extracted_text += text
    return extracted_text

        
@app.route('/img', methods=['POST'])
def read_img():
    global extracted_images
    data = request.get_json()
    img_path = data.get('path') 
    frontend_base_url = str(os.getenv("FRONTEND_URL"))
    img_url = f"{frontend_base_url}{img_path}"

    try:
        # Construct images' full URLs
        response_img = requests.get(img_url)
        response_img.raise_for_status()
        image_names = response_img.text.splitlines()
       
        image_urls = [f"{img_url.replace('list.txt','')}/{image_name}" for image_name in image_names]

        for image_url in image_urls:
        # Fetch the images from the URL
            response_img = requests.get(image_url)
            response_img.raise_for_status()
            img = Image.open(io.BytesIO(response_img.content))
            extracted_images.append(img)

        return jsonify({
            "message": "Images processed successfully.",
            "image_count": len(extracted_images)
            # "images": extracted_images
        }), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch image list: {str(e)}"}), 500
    

@app.route('/report', methods=['POST'])
def read_pdf():
    global extracted_context
    data = request.get_json()
    pdf_path = data.get('path') 
    frontend_base_url = str(os.getenv("FRONTEND_URL"))
    pdf_url = f"{frontend_base_url}{pdf_path}"

    try:
        # Fetch the PDF from the URL
        response_pdf = requests.get(pdf_url)
        response_pdf.raise_for_status()

        # Extract text from PDF stream
        pdf_stream = io.BytesIO(response_pdf.content)
        extracted_context = extract_text_from_pdf(pdf_stream)

        return jsonify({
            "message": "PDF processed successfully.",
            "file_path": pdf_url
        }), 200
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat_with_model():
    global extracted_context, extracted_images
    user_message = request.json.get("message", "")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if not extracted_images:
        print( "No images extracted. Please ensure the PDF is processed first.")

    # Handle extracted images and context 
    history = [
        {"role": "user", "parts": ["For all subsequent queries, use this file for context: ", extracted_context]},
        # {"role": "user", "parts": ["The file also includes these images: ", extracted_images]},
        {"role": "user", "parts": extracted_images},
        {"role": "user", "parts": ["Keep responses to 100 words or less."]},
    ]
    chat = model.start_chat(history=history)

    try:
        response = chat.send_message(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error during chat processing: {str(e)}")
        return jsonify({"error": "Error processing the message"}), 500

if __name__ == "__main__":
    app.run(debug=True)