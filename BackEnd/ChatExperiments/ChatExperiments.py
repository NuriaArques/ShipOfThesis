import requests
import time
import json

# Flask API endpoints
BASE_URL = "http://127.0.0.1:5000"  # Change if necessary
CHAT_ENDPOINT = f"{BASE_URL}/chat"

# Test questions
TEST_QUESTIONS_ = [
    "What are the key points from the report?",
    "What are the key points from the report?",
    "Summarize the findings in one sentence.",
    "Summarize the findings in one sentence.",
    "What is the main topic discussed?",
    "What is the main topic discussed?",
    "Does the report mention any statistics?",
    "Does the report mention any statistics?",
    "Are there any recommendations given?",
    "Are there any recommendations given?"
]
TEST_QUESTIONS = [
    "How many ID have a roughness equal or higher than 2.5?",
    "How many ID have a roughness equal or higher than 2.5?",
    "Which ID has the highest roughness? And which has the lowest?",
    "Which ID has the highest roughness? And which has the lowest?",
    "Average roughness. How many and which IDs are below?",
    "Average roughness. How many and which IDs are below?",
    "How many images show the interior of a yacht?",
    "How many images show the interior of a yacht?",
    "Describe the image corresponding to the ID with the highest roughness value?",
    "Describe the image corresponding to the ID with the highest roughness value?"
]

def chat_with_model(message, use_text=True):
    """Send a chat request to the model, optionally including extracted text."""
    payload = {"message": message}
    
    headers = {"Content-Type": "application/json"}
    
    start_time = time.time()
    response = requests.post(CHAT_ENDPOINT, json=payload, headers=headers)
    end_time = time.time()
    
    if response.status_code == 200:
        response_data = response.json().get("response", "No response")
        response_time = end_time - start_time
        return response_data, response_time
    else:
        return f"Error: {response.json()}", None

def run_tests():
    results_json = []
    
    for question in TEST_QUESTIONS:
        print(f"Testing: {question}")
        
        response, time = chat_with_model(question)
        
        results_json.append({
            "question": question,
            "response": response,
            "time": time
        })
    
    # Save results
    with open("test_results_text-images.json", "w") as f:
        json.dump(results_json, f, indent=4)
    print("\nTest results saved to test_results.json")

if __name__ == "__main__":
    run_tests()
