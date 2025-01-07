import csv
from os import listdir
import os
from os.path import isfile, join
from test import generateExplanation
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Image, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Indenter


data = r"BackEnd\reportGeneration\data"

def getAllCSV(url):
    return  [f for f in listdir(url) if isfile(join(url, f))]

def makeSureOnlyCSV(files):
    checked = []
    for a in files:
        if(a[len(a)-4:len(a)]==".csv"):
            checked.append(a)
    return checked

def extractCSV(url):
    with open(url, newline='') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        information = []
        for row in csvReader:
            instance = "".join(row)
            information.append(instance)
        return information

def formulateData(doc):
    columns = doc[0].split(";")
    if(len(columns)==1):
        columns= doc[0].split(", ")
    text = ""
    for line in doc[1:]:
        string = line.split(";")
        if(len(string)==1):
            string = line.split(", ")
        for x in range(len(string)):
            text = text + columns[x]+": "+string[x]+"\n"
        text = text+"\n"
    return text

document = []

csvFiles = makeSureOnlyCSV(getAllCSV(data))

for file in csvFiles:
    document.append(extractCSV(data+"\\"+file))

finalString = []
for d in document:
    finalString.append(formulateData(d))
f = open(r"BackEnd\reportGeneration\document", "w")
for line in finalString:
  f.write(line+"\n")
f.close()

def generateReport(finalString, modelOutput, path):

    #Library doesnt interpret \n as next line
    modelOutput = modelOutput.replace("\n", "<br/>")

    # Create PDF document with path
    doc = SimpleDocTemplate(path, pagesize=letter)
    
    # Text styles
    styles = getSampleStyleSheet()
 
    story = []
    
    # Add Title
    title_heading = Paragraph("Quality Report of Yacht Sanding", styles['Title'])
    story.append(title_heading)
    # Space below
    story.append(Spacer(2, 24))  
    # Indent next text to the left
    story.append(Indenter(left=-45))
    
    # Add Summary and heading
    Summary_heading = Paragraph("Summary of Data", styles['Heading1'])
    story.append(Summary_heading)
    story.append(Spacer(1, 6))
    # Add summary content
    story.append(Paragraph(modelOutput, styles['BodyText']))
    story.append(Spacer(1, 12))
    
    # Add Appendix Heading
    subtitle_appendix = Paragraph("Appendix", styles['Heading1'])
    story.append(subtitle_appendix)
    story.append(Spacer(1, 12))
    # Indent next table to the right again
    story.append(Indenter(left=45))
    
    # table data
    table_data = [["Image", "Content"]]  # Header row
    
    for line in finalString:
        try:
            # Get the text content
            text_lines = line.split("\n")[:3]  
            details_text = "<br/>".join(text_lines)
            
            if len(details_text) == 0:
                continue

            # Get image path
            image_info = line.split("\n")[3]  
            image_path = f"BackEnd/reportGeneration/data/pictures/{image_info.split(' ')[1]}"
            
            # Make sure the image actually exists and then put in table
            if os.path.exists(image_path):
                img = Image(image_path, width=150, height=150)
            else:
                img = Paragraph("No Image", styles['BodyText'])
            
            table_data.append([img, Paragraph(details_text, styles['BodyText'])])

        except Exception as e:
            # Handle cases with missing data
            table_data.append(["No Image", Paragraph("Content missing", styles['BodyText'])])
    
    # Create Table for the yacht data
    # Size of the coloumns for the table
    table = Table(table_data, colWidths=[170, 380])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),  # Header background
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # Header text color
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Center align all cells
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Bold header
        ('FONTSIZE', (0, 0), (-1, 0), 14),  # Header font size
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),  # Padding for header
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),  # Data background
        ('GRID', (0, 0), (-1, -1), 1, colors.black),  # Black borders
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),  # Vertically align content
    ]))

    # Add table to story
    story.append(table)
    
    #Building PDF
    try:
        doc.build(story)
        print(f"Report created at: {path}")
    except Exception as e:
        print(f"Error creating PDF: {e}")


user_message = "List all IDs with status readyToPaint=false and their corresponding roughness in ascending matter and compute average roughness of all ID and standardDeviation. Do not give steps to your calculations. Talk about relevance of the roughness on painting process in yacht painting process."
system_message = """You are Qwen, created by Alibaba Cloud. Answer each question in document format based on these data: 
""".join(finalString)
x = generateExplanation(system_message,user_message)
x = ''.join(x.split("User:")[1])
x = x.split(":")
x=''.join(x[2:])

# Prepare finalString as a list of entries
finalString = ''.join(finalString).split("\n\n")
print(finalString[0])

path = "FrontEnd\public\yachts\grand-sturdy\grand-sturdy-30-ac\Report_GS30AC_12-2024.pdf"

generateReport(finalString, x, path)




