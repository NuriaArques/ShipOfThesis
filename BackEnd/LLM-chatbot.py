from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import PyPDF2
import requests
import os
import io
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, origins=['http://127.0.0.1:3000', 'http://localhost:3000']) # Allow app origins


load_dotenv()
genai_api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=genai_api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

def extract_text_from_pdf(pdf_stream):
    pdf_reader = PyPDF2.PdfReader(pdf_stream)
    extracted_text = ""
    for page in pdf_reader.pages:
        text = page.extract_text()
        if text:
            extracted_text += text
    return extracted_text

extracted_context = ""


@app.route('/report', methods=['POST'])
def read_pdf():
    global extracted_context
    data = request.get_json()
    pdf_path = data.get('path') 
    frontend_base_url = str(os.getenv("FRONTEND_URL"))
    pdf_url = f"{frontend_base_url}{pdf_path}"
    
    try:
        # Fetch the PDF from the URL
        response = requests.get(pdf_url)
        response.raise_for_status()

        # Extract text from PDF stream
        pdf_stream = io.BytesIO(response.content)
        extracted_context = extract_text_from_pdf(pdf_stream)

        return jsonify({"message": "PDF downloaded successfully", "file_path": pdf_url}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat_with_model():
    global extracted_context
    user_message = request.json.get("message", "")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    chat = model.start_chat(
        history=[
            {"role": "user", "parts": ["For all subsequent queries, use this file for context: ", extracted_context]},
            {"role": "user", "parts": "Keep responses to 100 words or less."},
        ]
    )

    try:
        response = chat.send_message(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error during chat processing: {str(e)}")
        return jsonify({"error": "Error processing the message"}), 500

if __name__ == "__main__":
    app.run(debug=True)