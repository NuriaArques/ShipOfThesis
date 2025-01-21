import csv
from os import listdir
import os
from os.path import isfile, join
import time
import pandas as pd
from ReportAPI import generateExplanation
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Image, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Indenter
import generateJSON
import json
from datetime import datetime


###Just an experiment file but in case someone wants to rerun them most were run on both these files

    # Returns all csv files in directory
def getAllCSV(url):
        return  [f for f in listdir(url) if isfile(join(url, f))]

    # Checks if files are all csv type
def makeSureOnlyCSV(files):
    checked = []
    for a in files:
        if(a[len(a)-4:len(a)]==".csv"):
            checked.append(a)
        return checked

# Extracts content of file as a list
def extractCSV(url,howMany):
    with open(url, newline='') as csvfile:
        anotherCounter = howMany
        counter = 0
        ratio = 0
        target = 0
        csvReader = csv.reader(csvfile, delimiter='\n', quotechar='|')
        information = []
        counterHelpMe = True
        for row in csvReader:
            if(counterHelpMe):
                counterHelpMe = False
             
                holder = row[0].split("\t")
                
                instance = "".join(row)
                information.append(instance)
            else:
                if(howMany==0):
                    break
                holder = row[0].split("\t")
                state = float(holder[2])
                if(ratio<target and float(state)==0):
                    continue
                instance = "".join(row)
                information.append(instance)
                howMany=howMany-1
                if(state==1):
                    counter = counter+1
                ratio = counter/(anotherCounter-howMany)
            
        return information

# Formats data in document in a structured manner
def formulateData(doc):
    columns = doc[0].split("\t")
    text = ""
    id = 0
    for line in doc[1:]:
        
        text = text + "ID: "+str(id)+"\n"
        id = id+1
        string = line.split("\t")
        for x in range(len(string)):
            text = text + columns[x]+": "+string[x]+"\n"
        text = text+"\n"
    return text



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
    table_data = [["Image","HeatMap", "Content"]]  # Header row
    
    for line in finalString:
        try:
            # Get the text content
            text_lines = [line.split("\n")[0], line.split("\n")[3]] 
            details_text = "<br/>".join(text_lines)
            
            if len(details_text) == 0:
                continue

            # Get image path
            image_info = line.split("\n")[1]
            image_info_heat = line.split("\n")[2]  

            image_path_heat = "BackEnd/reportGeneration/data/pictures3/heatmaps/"+image_info_heat.split(' ')[1]
            image_path = "BackEnd/reportGeneration/data/pictures3/images/"+image_info.split(' ')[1]
            # Make sure the image actually exists and then put in table
            if os.path.exists(image_path):
                img = Image(image_path, width=150, height=150)
            else:
                img = Paragraph("No Image", styles['BodyText'])
            if os.path.exists(image_path_heat):
                img_heat = Image(image_path_heat, width=150, height=150)
            else:
                img_heat = Paragraph("No Image", styles['BodyText'])
            
            table_data.append([img,img_heat, Paragraph(details_text, styles['BodyText'])])

        except Exception as e:
            # Print Exception for missing data
            print(f"Missing Data: {e}")
            
    
    # Create Table for the yacht data
    # Size of the coloumns for the table
    table = Table(table_data, colWidths=[150, 150])
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

# Check for csv files





def howMany(howMany):
    data = r"BackEnd\reportGeneration\data"
    document = []
    csvFiles = makeSureOnlyCSV(getAllCSV(data))
    for file in csvFiles:
        document.append(extractCSV(data+"\\"+file,howMany))

    finalString = []
    # Iterates through the csv data and formats it properly
    for d in document:
        finalString.append(formulateData(d))

    # Writes the formatted data in the document
    f = open(r"BackEnd\reportGeneration\document", "w")
    for line in finalString:
        f.write(line+"\n")
    f.close()
    generateJSON.main()

        # Open and read the JSON file
    with open('FrontEnd\public\yachts\grand-sturdy\grand-sturdy-30-ac\lasering-info.json', 'r') as file:
            data = json.load(file)

    ratio = data['ratio']
    # Creating Prompt for Qwen Model and how it should it create the report
    date = datetime.today().strftime('%Y-%m-%d')
    user_message = "Create a brief report for workers in yacht manufacturing of a routine quality inspection. Todays date is "+date+ "Is is very important that you write something. Create a summary of the report knowing that the ratio of succesfull parts is "+str(ratio)+". Talk about relevance of the roughness in yacht painting process while remembering that roughness of at least 2.5 is crucial for good pain adhesion."
    system_message = """You are Qwen, created by Alibaba Cloud. Answer each question in document format based on these data: 
    """.join(finalString)
    x = generateExplanation(system_message,user_message)
    x = ''.join(x.split("User:")[1])
    x = x.split(":")
    x=''.join(x[2:])

    # Prepare finalString as a list of entries
    finalString = ''.join(finalString).split("\n\n")

    # Path of where the report is created
    path = "FrontEnd\public\yachts\grand-sturdy\grand-sturdy-30-ac\Report_GS30AC_12-2024.pdf"
    generateReport(finalString, x, path)

times = []
amount = []
for i in range(23):
    currentTime = time.time()
    howMany((i+1)*10)
    howLong = time.time()-currentTime
    amount.append((i+1)*10)

    times.append(howLong)
    print(times)

data = {"Amount": amount,"Times": times}
df = pd.DataFrame(data)

# Save to a CSV file
df.to_csv("times_and_amount.csv", index=False)
