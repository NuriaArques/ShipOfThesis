# ShipOfThesis

Open a terminal and run the following commands.


## Installation 
1. Clone the repository:
```
git clone https://github.com/NuriaArques/ShipOfThesis.git
cd ShipOfThesis
```

2. Create a virtual environment (optional)
```
python -m venv ShipOfThesis
ShipOfThesis\Scripts\activate
```
3. Run the `requirements.txt` file and verify the intallation
```
pip install -r requirements.txt
pip list
```

4. Install the dependencies
```
npm install
```
5. To start the website, run the following commands 
```
npm start
```
6. Deactivate the environment
```
deactivate
```

# Report generation
1. First install the all the requirements from the file

2. Make sure all the relevant pictures are in   `BackEnd\reportGeneration\data\picturesRaw` directory in their corresponding folder

3. Put your csv data into `BackEnd\reportGeneration\data`

4. Run 
```
python3 BackEnd\reportGeneration\compressor.py
```

5. run 
```
python3 BackEnd\reportGeneration\report_generation_final.py
```

6. The report is ready
