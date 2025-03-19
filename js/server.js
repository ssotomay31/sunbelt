const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors()); // Allow frontend requests

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Fetch images from Cloudinary "carousel" folder
app.get("/fetch-carousel-images", async (req, res) => {
    try {
        const response = await cloudinary.api.resources({
            type: "upload",
            prefix: "carousel/",
            max_results: 10
        });

        const imageUrls = response.resources.map(img => img.secure_url);
        res.json(imageUrls);
    } catch (error) {
        console.error("❌ ERROR: Failed to fetch Cloudinary images:", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});