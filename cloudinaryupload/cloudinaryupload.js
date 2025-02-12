const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dnculoaat",
  api_key: "252441168754462",
  api_secret: "RP9Goo7Ltm48WjV8Lx1RhmCFaDI"
});

// Define folder where your local images are stored
const localImagesFolder = path.join(__dirname, "../images/property_img");

// Read all files from the local images folder
fs.readdir(localImagesFolder, (err, files) => {
  if (err) {
    console.error("Error reading images folder:", err);
    return;
  }

  files.forEach(file => {
    const propertyName = path.parse(file).name.toLowerCase().replace(/\s+/g, '');
    const filePath = path.join(localImagesFolder, file);

    // Upload to Cloudinary
    cloudinary.uploader.upload(filePath, {
      folder: "property_img",  // Cloudinary folder name
      public_id: propertyName, // Standardized property name
      overwrite: true
    }, (error, result) => {
      if (error) {
        console.error(`Error uploading ${file}:`, error);
      } else {
        console.log(`Uploaded ${file} → ${result.secure_url}`);
      }
    });
  });
});