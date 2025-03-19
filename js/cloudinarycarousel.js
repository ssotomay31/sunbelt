document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "http://localhost:5001/fetch-carousel-images";

    try {
        const response = await fetch(API_URL);
        const images = await response.json();

        if (!images || images.length === 0) {
            console.error("❌ ERROR: No images found for the carousel.");
            return;
        }

        const formattedImages = images.map(img => img.secure_url);
        loadCarousel(formattedImages);
    } catch (error) {
        console.error("❌ ERROR: Failed to load images:", error);
    }
});

function loadCarousel(images) {
    const carousel = document.getElementById("projectCarousel");
    const dotsContainer = document.getElementById("carouselDots");

    let currentSlide = 0;
    const slideInterval = 5000;

    carousel.innerHTML = images.map(
        (src, index) => `<div class="carousel-slide ${index === 0 ? "active" : ""}">
                            <img src="${src}" alt="Carousel Image ${index + 1}">
                         </div>`
    ).join("");

    dotsContainer.innerHTML = images.map(
        (_, index) => `<span class="carousel-dot ${index === 0 ? "active" : ""}" data-index="${index}"></span>`
    ).join("");

    document.querySelectorAll(".carousel-dot").forEach(dot => {
        dot.addEventListener("click", () => {
            currentSlide = parseInt(dot.getAttribute("data-index"));
            updateCarousel(images, currentSlide);
        });
    });

    function updateCarousel(images, index) {
        document.querySelectorAll(".carousel-slide").forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
        document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    setInterval(() => {
        currentSlide = (currentSlide + 1) % images.length;
        updateCarousel(images, currentSlide);
    }, slideInterval);
}