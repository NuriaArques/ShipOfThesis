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
from pdf2image import convert_from_path

app = Flask(__name__)

 # Allow cross-origin requests from frontend
CORS(app, origins=['http://127.0.0.1:3000', 'http://localhost:3000']) 

# Load environment variables from .env file
load_dotenv()
genai_api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=genai_api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

extracted_images = []

@app.route('/report', methods=['POST'])
def read_pdf():
    global extracted_images
    data = request.get_json()
    pdf_path = data.get('path') # Get PDF path from frontend request
    frontend_base_url = str(os.getenv("FRONTEND_URL"))
    pdf_url = f"{frontend_base_url}{pdf_path}" # Construct full PDF URL

    try:
        # Fetch the PDF file from the provided URL
        response_pdf = requests.get(pdf_url)
        response_pdf.raise_for_status()
        pdf_stream = io.BytesIO(response_pdf.content)

        # Extract as many images as pages has the PDF
        extracted_images = convert_from_path(pdf_url)

        return jsonify({
            "message": "PDF processed successfully.",
            "file_path": pdf_url,
            "pages": len(extracted_images)
        }), 200
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat_with_model():
    global extracted_images
    user_message = request.json.get("message", "") # Get user message from request
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Construct chat history with extracted_images as context
    history = [
        {"role": "user", "parts": ["For all subsequent queries, use these images for context: "]},
        {"role": "user", "parts": extracted_images},
        {"role": "user", "parts": ["Keep responses to 100 words or less. ", 
                                    "Only answer user queries with the context given above, if no information can be found just reply 'This is not from the report. Ask a question about it. Thanks'."]},
    ]
    chat = model.start_chat(history=history)

    try:
        response = chat.send_message(user_message) # Send user message to AI model
        return jsonify({"response": response.text}) # Return AI response
    except Exception as e:
        print(f"Error during chat processing: {str(e)}")
        return jsonify({"error": "Error processing the message"}), 500

if __name__ == "__main__":
    app.run(debug=False)