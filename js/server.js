require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5001; // Change this if needed

// Allow CORS for all origins (or restrict it to your frontend)
app.use(cors({
  origin: "http://127.0.0.1:5500" // Adjust if your frontend is hosted elsewhere
}));

// Cloudinary API Configuration
const cloudinaryBaseURL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=carousel/&max_results=10`;

// Route to fetch carousel images from Cloudinary
app.get("/fetch-carousel-images", async (req, res) => {
    try {
        const response = await axios.get(cloudinaryBaseURL, {
            headers: {
                Authorization: `Basic ${Buffer.from(
                    process.env.CLOUDINARY_API_KEY + ":" + process.env.CLOUDINARY_API_SECRET
                ).toString("base64")}`
            }
        });

        res.json(response.data.resources); // Send image data to frontend
    } catch (error) {
        console.error("❌ ERROR: Failed to fetch images from Cloudinary", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));