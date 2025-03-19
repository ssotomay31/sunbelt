document.addEventListener("DOMContentLoaded", async () => {
    const cloudinaryBaseURL = "https://res.cloudinary.com/dnculoaat/image/upload/";
    const cloudinaryFolder = "carousel"; // Cloudinary folder where images are stored

    async function fetchCarouselImages() {
        try {
            // Fetch images from Cloudinary using the Admin API
            const response = await fetch(`https://api.cloudinary.com/v1_1/dnculoaat/resources/image/upload?prefix=${cloudinaryFolder}/&max_results=10`, {
                headers: {
                    "Authorization": "Basic " + btoa("252441168754462:RP9Goo7Ltm48WjV8Lx1RhmCFaDI") // Use API credentials
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Extract latest versioned URLs from the response
            const images = data.resources.map(img => img.secure_url);

            return images;
        } catch (error) {
            console.error("❌ ERROR: Failed to fetch images from Cloudinary:", error);
            return [];
        }
    }

    async function loadCarousel() {
        const images = await fetchCarouselImages();
        if (images.length === 0) {
            console.error("❌ ERROR: No images found for the carousel.");
            return;
        }

        const carousel = document.getElementById("projectCarousel");
        const dotsContainer = document.getElementById("carouselDots");
        let currentSlide = 0;
        const slideInterval = 5000; // Auto-scroll interval

        // Load images dynamically
        carousel.innerHTML = images
            .map((src, index) =>
                `<div class="carousel-slide ${index === currentSlide ? "active" : ""}">
                    <img src="${src}" alt="Project ${index + 1}">
                </div>`
            )
            .join("");

        // Generate navigation dots
        dotsContainer.innerHTML = images
            .map((_, index) =>
                `<span class="carousel-dot ${index === currentSlide ? "active" : ""}" data-index="${index}"></span>`
            )
            .join("");

        document.querySelectorAll(".carousel-dot").forEach(dot => {
            dot.addEventListener("click", () => {
                currentSlide = parseInt(dot.getAttribute("data-index"));
                updateCarousel();
            });
        });

        function updateCarousel() {
            document.querySelectorAll(".carousel-slide").forEach((slide, index) => {
                slide.classList.toggle("active", index === currentSlide);
            });

            document.querySelectorAll(".carousel-dot").forEach((dot, index) => {
                dot.classList.toggle("active", index === currentSlide);
            });
        }

        function autoScroll() {
            currentSlide = (currentSlide + 1) % images.length;
            updateCarousel();
        }

        setInterval(autoScroll, slideInterval);
    }

    loadCarousel();
});