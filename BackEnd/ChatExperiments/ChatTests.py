import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_average_time(json_file):
    with open(json_file, 'r') as file:
        data = json.load(file)
    
    times = [entry["time"] for entry in data]
    return sum(times) / len(times) if times else 0


def compare_variation(json_file):
    with open(json_file, 'r') as file:
        data = json.load(file)
    
    question_pairs = {}
    for entry in data:
        question = entry["question"]
        response = entry["response"]
        time = entry["time"]
        
        if question not in question_pairs:
            question_pairs[question] = []
        question_pairs[question].append((response, time))
    
    variations = {}
    time_variations = []
    text_variations = []
    number_equality_check = {}

    for idx, (question, responses) in enumerate(question_pairs.items()):
        if len(responses) == 2:
            response1, time1 = responses[0]
            response2, time2 = responses[1]
            
            time_variation = abs(time1 - time2)

            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform([response1, response2])
            text_similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
            
            if idx >= 3:
                numbers1 = [float(num) for num in response1.split() if num.replace('.', '', 1).isdigit()]
                numbers2 = [float(num) for num in response2.split() if num.replace('.', '', 1).isdigit()]
                if not numbers1 or not numbers2:
                    numbers_match = None
                else:
                    numbers_match = (numbers1 == numbers2)
            else: 
                numbers_match = None
            number_equality_check[question] = numbers_match

            variations[question] = {
                "time_variation": time_variation,
                "text_similarity": text_similarity,
                "numbers_match": numbers_match
            }
            time_variations.append(time_variation)
            text_variations.append(text_similarity)

    average_time_variation = sum(time_variations) / len(time_variations) if time_variations else 0
    average_text_variation = sum(text_variations) / len(text_variations) if text_variations else 0
    total_matching_numbers = sum(1 for match in number_equality_check.values() if match)
    
    return variations, average_time_variation, average_text_variation, total_matching_numbers


json_files = ['test_results_text.json', 'test_results_text-images.json', 'test_results_images.json']
for json_filename in json_files:
    print(f"\n{json_filename}")

    average = calculate_average_time(json_filename)
    print(f"     Average time: {average:.2f} seconds")

    variations, avg_time_variation, avg_text_variations, total_matching_numbers = compare_variation(json_filename)
    print(f"     Average time variation: {avg_time_variation:.2f} seconds")
    print(f"     Average response similarity: {avg_text_variations:.2%}")
    print(f"     Number of questions where the numbers match: {total_matching_numbers}")

    # for question, metrics in variations.items():
    #     print(f"\nQuestion: {question}")
    #     print(f"Time Variation: {metrics['time_variation']:.6f} seconds")
    #     print(f"Text Similarity (TF-IDF Cosine): {metrics['text_similarity']:.2%}")
    #     print(f"Numbers Match: {'Yes' if metrics['numbers_match'] else 'No'}")
