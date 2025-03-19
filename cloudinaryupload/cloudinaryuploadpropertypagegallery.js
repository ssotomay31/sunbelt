const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dnculoaat",
  api_key: "252441168754462",
  api_secret: "RP9Goo7Ltm48WjV8Lx1RhmCFaDI"
});

// Define the folder where local property images are stored
const localImagesFolder = path.join(__dirname, "../images/property_pages_imgs");

// Read all property folders
fs.readdir(localImagesFolder, (err, folders) => {
  if (err) {
    console.error("❌ Error reading property image folders:", err);
    return;
  }

  folders.forEach(folder => {
    const folderPath = path.join(localImagesFolder, folder);

    // Ensure it's a directory
    if (!fs.statSync(folderPath).isDirectory()) return;

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(`❌ Error reading images for ${folder}:`, err);
        return;
      }

      files.forEach((file, index) => {
        const filePath = path.join(folderPath, file);
        const imageName = `${folder}${index + 1}`; // Naming convention: folderName1, folderName2, etc.

        // Upload to Cloudinary
        cloudinary.uploader.upload(filePath, {
          folder: `property_pages_imgs/${folder}`, // Organize by property
          public_id: imageName, 
          overwrite: true,
          format: "jpg" // Ensure consistent format
        }, (error, result) => {
          if (error) {
            console.error(`❌ Error uploading ${file} for ${folder}:`, error);
          } else {
            console.log(`✅ Uploaded ${file} → ${result.secure_url}`);
          }
        });
      });
    });
  });
});