import csv
from os import listdir
from os.path import isfile, join
data = r"src\reportGeneration\data";
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
f = open(r"src\reportGeneration\document", "w")
for line in finalString:
  f.write(line+"\n")
f.close()

