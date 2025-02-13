import os
import csv
import glob
import cloudinary
import cloudinary.api

# Cloudinary Configuration
cloudinary.config(
    cloud_name="dnculoaat",
    api_key="252441168754462",
    api_secret="RP9Goo7Ltm48WjV8Lx1RhmCFaDI"
)

# Define paths
input_csv = "/Users/sebastiansotomayor/Desktop/sunbeltwebpublish/data/sunbelt.csv"
output_dir = "/Users/sebastiansotomayor/Desktop/sunbeltwebpublish/properties"
template_path = "/Users/sebastiansotomayor/Desktop/sunbeltwebpublish/template/property_template.html"

# Cloudinary Base URL
cloudinary_base_url = "https://res.cloudinary.com/dnculoaat/image/upload/property_img/"

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

# Debugging: Ensure template contains placeholders
print("DEBUG: Checking if {{THUMBNAIL_IMG}} exists in template:", "{{THUMBNAIL_IMG}}" in html_template)

# Read data from CSV and generate HTML files
with open(input_csv, "r") as csv_file:
    reader = csv.DictReader(csv_file)

    for row in reader:
        # Ensure required columns exist
        if "name" not in row or "img" not in row:
            print(f"⚠️ WARNING: Skipping row due to missing columns: {row}")
            continue

        # Generate property-specific name format
        property_name = row["name"].lower().replace(" ", "").replace(",", "").replace(".", "")

        # Cloudinary Thumbnail Image
        thumbnail_img = row["img"].strip() if row["img"] else "default.jpg"
        thumbnail_url = f"{cloudinary_base_url}{thumbnail_img}"

        # Debugging: Ensure URL is formatted correctly
        print(f"DEBUG: Thumbnail URL for {property_name}: {thumbnail_url}")

        # Fetch all images from Cloudinary folder
        try:
            response = cloudinary.api.resources(
                type="upload",
                prefix=f"property_img/{property_name}/",
                max_results=50
            )

            # Get all image URLs, sorted alphabetically
            gallery_images = sorted(
                [img["secure_url"] for img in response["resources"]]
            )

        except Exception as e:
            print(f"⚠️ WARNING: Error fetching images for {property_name}: {e}")
            gallery_images = []

        # Generate Gallery HTML
        gallery_html = "".join(
            f'<div class="gallery-item">'
            f'<img src="{img}" alt="{row["name"]}" loading="lazy">'
            f'</div>'
            for img in gallery_images
        ) if gallery_images else '<p>No images available.</p>'

        # Replace placeholders in the template
        page_content = html_template.replace("{{PROPERTY_NAME}}", row["name"])
        page_content = page_content.replace("{{CITY}}", row["city"])
        page_content = page_content.replace("{{SIZE}}", row["size"] or "N/A")
        page_content = page_content.replace("{{YEAR}}", row["year"] or "N/A")
        page_content = page_content.replace("{{DESCRIPTION}}", row["description"] or "")
        page_content = page_content.replace("{{GALLERY}}", gallery_html)

        # Ensure the placeholder exists before replacing
        if "{{THUMBNAIL_IMG}}" in page_content:
            print(f"DEBUG: Found THUMBNAIL_IMG placeholder. Replacing with {thumbnail_url}")
            page_content = page_content.replace("{{THUMBNAIL_IMG}}", thumbnail_url)
        else:
            print(f"⚠️ WARNING: Thumbnail placeholder NOT found in template for {property_name}")

        # Write the HTML file
        output_file = os.path.join(output_dir, f"{property_name}.html")
        with open(output_file, "w") as f:
            f.write(page_content)
            print(f"✅ Generated: {output_file}")