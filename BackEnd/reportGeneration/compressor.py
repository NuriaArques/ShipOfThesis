from PIL import Image
import os
###This file compresses all the pictures and adds them to correct repository. It is required to run before the report generation.



# Specify the directory
directory = "BackEnd/reportGeneration/data/picturesRaw/images/"
directory_heat = "BackEnd/reportGeneration/data/picturesRaw/heatmaps/"
directory_destination = "BackEnd/reportGeneration/data/pictures3/images/"
directory_heat_destination = "BackEnd/reportGeneration/data/pictures3/heatmaps/"

# Get all image files from the directory
image_extensions = {".png", ".jpg"}  # Add extensions as needed
image_files = [file for file in os.listdir(directory) if os.path.splitext(file)[1].lower() in image_extensions]
image_files_heat = [file for file in os.listdir(directory_heat) if os.path.splitext(file)[1].lower() in image_extensions]

print("Images found:")
for img in image_files:
    photo = Image.open(directory+img)
    photo = photo.resize((150, 150))
    photo.convert("RGB")
    photo.save(directory_destination+(img), optimize=True)

for img in image_files_heat:
    photo = Image.open(directory_heat+img)
    photo = photo.resize((150, 150))
    photo.convert("RGB")
    photo.save(directory_heat_destination+(img), optimize=True)

    # Open the original PNG file
