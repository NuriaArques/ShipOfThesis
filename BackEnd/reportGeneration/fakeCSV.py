import os
import random
import csv

# Specify the folder path
folder_path = 'BackEnd/reportGeneration/pictures2'

# List of supported image extensions
image_extensions = ['.png']

# Get all image files in the folder
image_files = [
    os.path.join(folder_path, file)
    for file in os.listdir(folder_path)
    if os.path.splitext(file)[1].lower() in image_extensions
]

fakeLength = int(len(image_files) / 2)
print(fakeLength)

# Prepare CSV data
line0 = ["ID", "isReadyToPaint", "photo", "photo_holo"]
lines = [line0]  # Start with the header

for i in range(fakeLength):
    isPas = random.randint(1, 100) >= 20  # 80% chance for True
    line = [
        str(i),
        str(isPas),
        f"BackEnd/reportGeneration/pictures2/image_{i}.png",
        f"BackEnd/reportGeneration/pictures2/image_{i}_heatmap.png",
    ]
    lines.append(line)

# Save the list as a CSV file
csv_file_path = 'BackEnd/reportGeneration/data/boat_data2.csv'  
with open(csv_file_path, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(lines)

print(f"CSV file has been saved as '{csv_file_path}'")
