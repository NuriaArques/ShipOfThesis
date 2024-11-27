import csv
from os import listdir
from os.path import isfile, join
#from ReportSummarizer import createSummary
from test import generateExplanation
from spire.doc import *
from spire.doc.common import *

data = r"BackEnd\reportGeneration\data";
def getAllCSV(url):
    return  [f for f in listdir(url) if isfile(join(url, f))]
def makeSureOnlyCSV(files):
    checked = []
    for a in files:
        if(a[len(a)-4:len(a)]==".csv"):
            checked.append(a)
    return checked
document = []

x = makeSureOnlyCSV(getAllCSV(data))



def extractCSV(url):
    with open(url, newline='') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        information = []
        for row in csvReader:
            instance = "".join(row)
            information.append(instance)
        return information
    

for file in x:
    document.append(extractCSV(data+"\\"+file))

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
finalString = []
for d in document:
    finalString.append(formulateData(d))
f = open(r"BackEnd\reportGeneration\document", "w")
for line in finalString:
  f.write(line+"\n")
f.close()


user_message = "List all IDs with status readyToPaint=false and their corresponding roughness in ascending matter and compute average roughness of all ID and standardDeviation. Do not give steps to your calculations. Talk about relevance of the roughness on painting process in yacht painting process."
system_message = """You are Qwen, created by Alibaba Cloud. Answer each question in document format based on these data: 
""".join(finalString)
x = generateExplanation(system_message,user_message)
x = ''.join(x.split("User:")[1])
x = x.split(":")
x=''.join(x[2:])



def generatePrettyReport(finalString, modelOutput):
    document = Document()

    # Add a section for the report
    section = document.AddSection()

    # Set page margins
    section.PageSetup.Margins.All = 72

    # Add a title paragraph
    title_paragraph = section.AddParagraph()
    title_range = title_paragraph.AppendText("Quality Report of Yacht Sanding")
    title_range.CharacterFormat.FontName = "Calibri"
    title_range.CharacterFormat.TextColor = Color.get_RoyalBlue()
    title_paragraph.ApplyStyle(BuiltinStyle.Heading1)
    title_paragraph.Format.HorizontalAlignment = HorizontalAlignment.Center
    title_paragraph.Format.AfterSpacing = 18



    subtitle_paragraph = section.AddParagraph()
    subtitle_range = subtitle_paragraph.AppendText("Summary of data")
    subtitle_range.CharacterFormat.FontName = "Calibri"
    subtitle_range.CharacterFormat.TextColor = Color.get_RoyalBlue()
    subtitle_paragraph.ApplyStyle(BuiltinStyle.Heading1)
    subtitle_paragraph.Format.HorizontalAlignment = HorizontalAlignment.Left
    subtitle_paragraph.Format.AfterSpacing = 14


    summary = section.AddParagraph()
    summary_range = summary.AppendText(modelOutput)
    summary_range.CharacterFormat.FontName = "Calibri"
    summary.ApplyStyle(BuiltinStyle.Heading1)
    summary.Format.HorizontalAlignment = HorizontalAlignment.Left
    summary.Format.AfterSpacing = 12
    summary_range.CharacterFormat.FontSize = 12


    # Create a table for the report (one table for all data)

    subtitle_paragraph2 = section.AddParagraph()
    subtitle_range2 = subtitle_paragraph2.AppendText("Appendix")
    subtitle_range2.CharacterFormat.FontName = "Calibri"
    subtitle_range2.CharacterFormat.TextColor = Color.get_RoyalBlue()
    subtitle_paragraph2.ApplyStyle(BuiltinStyle.Heading1)
    subtitle_paragraph2.Format.HorizontalAlignment = HorizontalAlignment.Left
    subtitle_paragraph2.Format.AfterSpacing = 14


   
    table = section.AddTable(True)
    table.ResetCells(len(finalString), 2)  # Rows = entries, Columns = Image and Text

    for idx, line in enumerate(finalString):
        
        # Get the row for the current line
        row = table.Rows[idx]
        image_cell = row.Cells[0]
        text_cell = row.Cells[1]
        #print(line)
        # (Optional) Add an image to the first cell
        try:
            picture_name = line.split("\n")[3]  # Extract image name from the line
            #print("BackEnd/reportGeneration/data/pictures/"+picture_name.split(" ")[1]+"\n")
            print(picture_name.split(" ")[1])
            image = image_cell.AddParagraph().AppendPicture("BackEnd/reportGeneration/data/pictures/" + picture_name.split(" ")[1])
            image.Width = 100
            image.Height = 100
        except Exception as e:
            a = 2

        # Add text to the second cell (one line at a time)
        lines = line.split("\n")[:3]  # Extract the first 3 lines
        for text_line in lines:
            text_paragraph = text_cell.AddParagraph()
            text_range = text_paragraph.AppendText(text_line)
            text_range.CharacterFormat.FontName = "Calibri"
            text_range.CharacterFormat.FontSize = 12

            # Ensure proper alignment for each text line
            text_paragraph.Format.HorizontalAlignment = HorizontalAlignment.Left
            text_paragraph.Format.LineSpacing = 15  # Line spacing
            text_paragraph.Format.AfterSpacing = 12  # Add spacing after each line

    # Save the document as a PDF
    try:
        document.SaveToFile("FrontEnd\public\yachts\grand-sturdy\grand-sturdy-30-ac\Report_GS30AC_12-2024.pdf", FileFormat.PDF)
        document.Close()
        print("PDF Report successfully generated!")
    except Exception as e:
        print(f"Error saving document: {e}")


# Generate the report


# Prepare finalString as a list of entries
finalString = ''.join(finalString).split("\n\n")

# Generate the report


print(finalString[0])
generatePrettyReport(finalString,x)

#print(x)