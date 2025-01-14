import os
import csv
import glob

# Define paths
input_csv = "/Users/sebastiansotomayor/Desktop/sunbeltweb/data/sunbelt.csv"
output_dir = "/Users/sebastiansotomayor/Desktop/sunbeltweb/properties"
template_path = "/Users/sebastiansotomayor/Desktop/sunbeltweb/template/property_template.html"
images_dir = "/Users/sebastiansotomayor/Desktop/sunbeltweb/images/property_pages_imgs"

# Ensure the output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created directory: {output_dir}")

# Remove old HTML files in the properties directory
old_files = glob.glob(f"{output_dir}/*.html")
for file in old_files:
    os.remove(file)
    print(f"Deleted: {file}")

# Read the HTML template from the external file
with open(template_path, "r") as template_file:
    html_template = template_file.read()

# Read data from CSV and generate HTML files
with open(input_csv, "r") as csv_file:
    reader = csv.DictReader(csv_file)

    for row in reader:
        # Generate property-specific folder and images
        property_name = row["name"].lower().replace(" ", "").replace(",", "").replace(".", "")
        property_dir = os.path.join(images_dir, property_name)
        images = []

        if os.path.exists(property_dir):
            images = [f for f in os.listdir(property_dir) if os.path.isfile(os.path.join(property_dir, f))]
        else:
            print(f"Image directory not found for {property_name}. Skipping images.")

        # Generate the gallery HTML with resized images
        gallery_html = "".join(
            f'<div class="gallery-item">'
            f'<img src="../images/property_pages_imgs/{property_name}/{img}" alt="{row["name"]}" loading="lazy">'
            f'</div>'
            for img in images
        )

        # Replace placeholders in the template
        page_content = html_template.replace("{{PROPERTY_NAME}}", row["name"])
        page_content = page_content.replace("{{CITY}}", row["city"])
        page_content = page_content.replace("{{SIZE}}", row["size"] or "N/A")
        page_content = page_content.replace("{{YEAR}}", row["year"] or "N/A")
        page_content = page_content.replace("{{DESCRIPTION}}", row["description"] or "")
        page_content = page_content.replace("{{GALLERY}}", gallery_html)
        page_content = page_content.replace("{{THUMBNAIL_IMG}}", row["img"] or "default.jpg")           
        # Write the HTML file
        output_file = os.path.join(output_dir, f"{property_name}.html")
        with open(output_file, "w") as f:
            f.write(page_content)
            print(f"Generated: {output_file}")