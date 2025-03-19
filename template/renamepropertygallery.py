import os

# Define the root directory where property images are stored
root_dir = "/Users/sebastiansotomayor/Desktop/sunbeltwebpublish/images/property_pages_imgs"

# Iterate over each property folder
for property_folder in os.listdir(root_dir):
    property_path = os.path.join(root_dir, property_folder)

    if os.path.isdir(property_path):  # Ensure it's a folder
        images = sorted(os.listdir(property_path))  # Get all image files
        
        for index, filename in enumerate(images, start=1):
            file_ext = os.path.splitext(filename)[1].lower()  # Get file extension
            new_filename = f"{property_folder}{index}{file_ext}"  # Format: [foldername]1.jpg
            old_file_path = os.path.join(property_path, filename)
            new_file_path = os.path.join(property_path, new_filename)

            os.rename(old_file_path, new_file_path)  # Rename file
            print(f"✅ Renamed: {filename} → {new_filename}")