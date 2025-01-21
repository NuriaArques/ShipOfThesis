import csv

##This class is used to generate JSON file for the UI summary

#This extract a csv saving each row as a seperate string in the list
def extractFile(url):
    with open(url, newline='\n') as csvfile:
        csvReader = csv.reader(csvfile, delimiter='\n', quotechar='|')
        information = []
        for row in csvReader:
            instance = "".join(row)
            information.append(instance)
        return information
#Use to run this class from report_generation file
#It is used to compute all details for the JSON file
def main():
    file = extractFile("BackEnd/reportGeneration/document")
    obj = getAllFailID(file)
    failed = (obj['failed'])
    total = (obj['total'])
    ratio = 1-len(failed)/total
    color = None
    readyToPaint = "NO"
    text = ""
    correction = failed
    if(ratio<0.8):
        color = "Red"
        text = r"Grand Sturdy 35.0 AC has a roughness below the required standard in more than 20% of its areas. Review the yacht again."
    if(ratio>=0.8):
        color = "Orange"
        readyToPaint = "ALMOST"
        text = r"Grand Sturdy 30.0 Sedan has achieved the roughness standards in more than 80% of its areas. Review the remaining ones and the yacht should be ready to paint"
    if(ratio==1):
        color = "Green"
        readyToPaint = "YES"
        text = r"Grand Sturdy 30.0 AC fulfills ALL the necessary standard requirements and is ready to be painted."
    id = "grand-sturdy-30-sedan"
    name = "Grand Sturdy 30.0 Sedan"
    generateJson(id,name,readyToPaint,color,text,correction,ratio,failed)


import json
import os
#This file generates JSON from the raw data
def generateJson(id,name,readyToPaint,color,text,correction,ratio,failed):
    data = {
    "id": id,
    "name": name,
    "readyToPaint": readyToPaint,
    "color": color,
    "text": text,
    "ratio": ratio,
    "corrections": failed
    }


    report_path = "FrontEnd/public/yachts/grand-sturdy/grand-sturdy-35-sedan"  
    json_file_path = os.path.join(report_path, "lasering-info.json")

    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

#This class returns all failed ids and counts how many are total
def getAllFailID(file):
    currentID = None
    failedID = []
    totalID = 0
    for i in range(len(file)):
        currentLine = file[i]
        if(currentLine[0:2]=="ID"):
            currentID = currentLine.split(": ")[1]
            totalID = totalID+1
        if(currentLine[0:7]=="readyTo"):
            currentStatus = currentLine.split(": ")[1]
            if(currentStatus=="0"):
                failedID.append(currentID)
    d = dict()
    d['failed'] = failedID
    d['total'] = totalID
    return d






    



        

