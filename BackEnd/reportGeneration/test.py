import json
import requests





def generateExplanation(input, user_message):
    system_message = input
    # Define the model and API endpoint
    API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct"
    headers = {"Authorization": "Bearer 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"}  # Replace with your Hugging Face API key
    input_text = f"System: {system_message}\nUser: {user_message}"
    payload = {
    "inputs": input_text,
    "parameters": {
        "max_new_tokens": 1024  # Adjust max_length if needed
        }
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    output = response.json()
    return(output[0]['generated_text'])
    
    return output
    