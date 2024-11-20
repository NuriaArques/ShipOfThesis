import google.generativeai as genai
#!pip install PyPDF2
import PyPDF2
genai.configure(api_key="AIzaSyBuUodVlbei_jX0ycrvFxKjzeXbluvY-d8")
model = genai.GenerativeModel("gemini-1.5-flash")

#PDF to text extractor
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        extracted_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text
        return extracted_text
    
#Change the string to the name of the file you want to use for context
contextText = extract_text_from_pdf("Yacht_Report.pdf")
#starts the chat, without it the LLM will not remember previous prompts
chat = model.start_chat(
        history=[
            {"role": "user", "parts": ["For all subsequent queries, use this file for context: ", contextText]},
            {"role": "user", "parts": "Keep responses to 100 words or less."},
        ]
    )

#Starts a chat with the bot
def beginChat():
    print("How may I help you?")
    textInput = input()
    response = chat.send_message(textInput)
    print(response.text)
    continueChat()

def continueChat():
    textInput = input()
    response = chat.send_message(textInput)
    print(response.text)
    continueChat()

beginChat()


