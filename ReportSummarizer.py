from transformers import pipeline
summarizer = pipeline("summarization", model="philschmid/bart-large-cnn-samsum")

def createSummary (input_data):
    # Creates Summary, num_beams = higher value - better summary - slower output 
    # Also we should tweak max and min length
    summary = summarizer(input_data, num_beams=10)
    summary_text = summary[0]['summary_text']
    return summary_text


# 1st type of input - More Tabular Structure
input_1 = """
    "Yacht Model": "Grand Sturdy 500",
    "Length": "15.5 meters",
    "Beam": "4.65 meters",
    "Engine Power": "150 HP",
    "Max Speed": "22 knots",
    "Material": "Steel",
    "Features": ["GPS navigation", "Autopilot", "Digital dashboard", "LED lighting"],
    "Last Maintenance": "2024-01-15",
    "Condition": "Excellent"
"""

# 2nd type of input - Sentence Format (Short)
input_2 = """
The Grand Sturdy 500 is a premium steel yacht, measuring 15.5 meters in length with a 4.65-meter beam, making it spacious and stable on the water. 
Powered by a 150 HP engine, it reaches a maximum speed of 22 knots, providing both a comfortable cruising experience and efficient performance. 
Equipped with advanced features like GPS navigation, autopilot, a digital dashboard, and LED lighting, it offers modern navigational support and ambiance. 
The yacht has been meticulously maintained, with its last service recorded in early 2017, and is currently in excellent condition, showcasing reliability and top-quality care.
"""

# 3rd type of input - Long Input
input_3 = """
The Grand Sturdy 500 is a luxurious and meticulously crafted steel yacht, designed to offer both style and functionality for discerning yacht enthusiasts. With an impressive length of 15.5 meters and a wide 4.65-meter beam, this vessel provides ample space on board, allowing for a comfortable and stable experience even in open waters. Its spacious layout makes it ideal for extended journeys, offering plenty of room for relaxation and socializing, as well as ensuring optimal balance and stability while cruising.
The yacht is powered by a robust 150-horsepower engine, which enables it to reach a top speed of 22 knots. This combination of power and speed ensures a smooth, efficient cruising experience, blending comfort with impressive performance capabilities that are ideal for both leisurely outings and more ambitious voyages.
Packed with state-of-the-art features, the Grand Sturdy 500 includes advanced GPS navigation for precise positioning, an autopilot system for hands-free control, a sleek digital dashboard for real-time monitoring, and LED lighting to enhance ambiance and visibility in various conditions. Together, these features offer a modern, user-friendly navigational experience that caters to both novice and seasoned sailors, ensuring safety, convenience, and a touch of luxury.
This yacht has been carefully maintained to the highest standards, with its most recent service recorded in early 2017. Thanks to regular upkeep and attention to detail, it remains in outstanding condition, reflecting its history of quality care and reliability. The Grand Sturdy 500 is more than just a yacht; it is a testament to expert craftsmanship and dedication to excellence, ready to provide its next owner with an unforgettable maritime experience.
"""

# Call Function
# Better to parse data in places where you want it to create its own summary
summary = createSummary(input_3)
print(summary)
