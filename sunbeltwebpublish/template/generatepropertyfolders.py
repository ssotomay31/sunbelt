import os
import csv

# Paths
input_csv = "/Users/sebastiansotomayor/Desktop/sunbeltweb/data/sunbelt.csv"
gallery_base_dir = "/Users/sebastiansotomayor/Desktop/sunbeltweb/images/property_pages_imgs"

# Ensure the gallery base directory exists
if not os.path.exists(gallery_base_dir):
    os.makedirs(gallery_base_dir)
    print(f"Created base gallery directory: {gallery_base_dir}")

# Read CSV and create folders
with open(input_csv, "r") as csv_file:
    reader = csv.DictReader(csv_file)

    for row in reader:
        # Standardize property name to generate folder name
        property_name = row["name"].lower().replace(" ", "").replace(",", "").replace(".", "")
        property_dir = os.path.join(gallery_base_dir, property_name)

        # Create the directory if it doesn't exist
        if not os.path.exists(property_dir):
            os.makedirs(property_dir)
            print(f"Created gallery folder for: {row['name']} -> {property_dir}")
        else:
            print(f"Folder already exists for: {row['name']} -> {property_dir}")