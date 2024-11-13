"It wont work right now for several reasons"
"""
Original file is located at
    https://colab.research.google.com/drive/1haHMrrLvWqEZ6frF5Z_4H8-O_zjVT_I7
"""

import transformers


model_name = 'Intel/neural-chat-7b-v3-2'
model = transformers.AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)

import csv
with open('/data/boat_data.csv', newline='') as csvfile:
    csvReader = csv.reader(csvfile, delimiter=',', quotechar='|')
    data = [];
    for row in csvReader:
        instance = "".join(row)
        data.append(instance)

print(data)

def generate_response(system_input, user_input):

    # Format the input using the provided template
    prompt = f"### System:\n{system_input}\n### User:\n{user_input}\n### Assistant:\n"

    # Tokenize and encode the prompt
    inputs = tokenizer.encode(prompt, return_tensors="pt", add_special_tokens=False)

    # Generate a response
    outputs = model.generate(inputs, max_length=50, num_return_sequences=1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract only the assistant's response
    return response.split("### Assistant:\n")[-1]

report = []
system_input = "You are responsible for creating a report. You will receive the data in 4 key words which are: "+data[0]+"."
for entry in data:
  if(entry==data[0]):
    continue
  user_input = entry
  response = generate_response(system_input, user_input)
  report.append(response)

f = open("/report.txt", "w")
for line in report:

  f.write(line+"\n")
f.close()

#open and read the file after the appending:

txt = report[0]
x= txt.split("\n")

!pip install spire.doc

from spire.doc import *
from spire.doc.common import *

# Create an object of the Document class
document = Document()

# Add a section
section = document.AddSection()

# Set page margins
section.PageSetup.Margins.All = 72

# Add a title paragraph to the section
title_paragraph = section.AddParagraph()

# Set text and format for the title paragraph
text_range = title_paragraph.AppendText("Quality report of yacht sanding")
text_range.CharacterFormat.FontName = "Calibri"
text_range.CharacterFormat.TextColor = Color.get_RoyalBlue()
title_paragraph.ApplyStyle(BuiltinStyle.Heading1)
title_paragraph.Format.HorizontalAlignment = HorizontalAlignment.Center
title_paragraph.Format.AfterSpacing = 18

# Add content paragraphs and images from the report
for line in report:
    # Add a new section for each line
    section = document.AddSection()

    # Set page margins
    section.PageSetup.Margins.All = 72

    # Create a table with two columns: one for the image, one for the text
    table = section.AddTable(True)
    table.ResetCells(1, 2)  # 1 row, 2 columns

    # Get the first row and its cells
    row = table.Rows[0]
    image_cell = row.Cells[0]
    text_cell = row.Cells[1]

    # Add an image to the first cell
    picture_name = line.split("\n")[3][5:]  # Extract image name
    image = image_cell.AddParagraph().AppendPicture("/data/pictures/" + picture_name)

    # Set image width and height
    image.Width = 100
    image.Height = 100

    # Add text to the second cell (first 3 lines of the report)
    text = line.split("\n")[:3]  # Get the first 3 lines of text
    string = '\n'.join(text)

    text_paragraph = text_cell.AddParagraph()
    text_range = text_paragraph.AppendText(string)
    text_range.CharacterFormat.FontName = "Calibri"
    text_range.CharacterFormat.FontSize = 12

    # Set spacing between the table cells and ensure text alignment
    text_paragraph.Format.HorizontalAlignment = HorizontalAlignment.Left
    text_paragraph.Format.LineSpacing = 15  # Ensure sufficient line spacing
    text_paragraph.Format.AfterSpacing = 18  # Add spacing after the paragraph

# Save the document to a file
try:
    document.SaveToFile("/data/report_with_picture.docx", FileFormat.Docx2019)
    document.Close()
except Exception as e:
    print(f"Error saving document: {e}")

!zip -r /data/file.zip /data