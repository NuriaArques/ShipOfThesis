import os
import fitz  # PyMuPDF
from PIL import Image

# Specify the folder path
folder_path = 'BackEnd/reportGeneration/data/dataFrom10'

# Destination folder for saving images
destination_folder = 'BackEnd/reportGeneration\pictures2'

# Ensure the destination folder exists
os.makedirs(destination_folder, exist_ok=True)

# List all files in the folder
pdf_files = [file for file in os.listdir(folder_path) if file.endswith('.pdf')]

pictures = []
counter2 = 0

def extractPicturesFromPDF(url,counter2):
    url = os.path.join(folder_path, url)
    pdf_file = fitz.open(url)
    counter = 1
    for page_index in range(len(pdf_file)):
        # Get the page itself
        page = pdf_file.load_page(page_index)  # Load the page
        image_list = page.get_images(full=True)  # Get images on the page

        # Printing number of images found in this page
        if image_list:
            print(f"[+] Found a total of {len(image_list)} images on page {page_index}")
        else:
            print("[!] No images found on page", page_index)
    
        for image_index, img in enumerate(image_list, start=1):
            # Get the XREF of the image
            xref = img[0]

            # Extract the image bytes
            base_image = pdf_file.extract_image(xref)
            image_bytes = base_image["image"]

            # Get the image extension
            image_ext = base_image["ext"]

            # Construct the image filename
            if counter % 2:
                image_name = f"image_{counter2}.{image_ext}"
            else:
                image_name = f"image_{counter2}_heatmap.{image_ext}"
                counter2 = counter2+1

            
            # Save the image to the destination folder
            image_path = os.path.join(destination_folder, image_name)
            with open(image_path, "wb") as image_file:
                image_file.write(image_bytes)
                print(f"[+] Image saved as {image_path}")
            counter += 1

    pdf_file.close()  # Close the PDF file
    return counter2


# Process all PDF files
for pdf_file in pdf_files:
    counter2 = extractPicturesFromPDF(pdf_file, counter2)

print("All images have been extracted and saved.")
