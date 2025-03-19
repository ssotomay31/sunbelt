const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Configure Cloudinary using .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dnculoaat",
  api_key: process.env.CLOUDINARY_API_KEY || "252441168754462",
  api_secret: process.env.CLOUDINARY_API_SECRET || "RP9Goo7Ltm48WjV8Lx1RhmCFaDI"
});

// Define local image directory
const localImagesFolder = path.join(__dirname, "../images/property_img");

// Allowed image formats
const allowedFormats = ["jpg", "jpeg", "png", "webp"];

// Read files from the local directory
fs.readdir(localImagesFolder, (err, files) => {
  if (err) {
    console.error("❌ Error reading images folder:", err);
    return;
  }

  // Process each file
  files.forEach(file => {
    const ext = path.extname(file).slice(1).toLowerCase(); // Extract file extension
    if (!allowedFormats.includes(ext)) {
      console.warn(`⚠️ Skipping non-image file: ${file}`);
      return;
    }

    const propertyName = path.parse(file).name.toLowerCase().replace(/\s+/g, '');
    const filePath = path.join(localImagesFolder, file);

    // Upload to Cloudinary
    cloudinary.uploader.upload(filePath, {
      folder: "property_img",
      public_id: propertyName,
      overwrite: true, // Overwrite existing images
      format: ext, // Keep original format
    }, (error, result) => {
      if (error) {
        console.error(`❌ Error uploading ${file}:`, error);
      } else {
        console.log(`✅ Uploaded ${file} → ${result.secure_url}`);
      }
    });
  });
});