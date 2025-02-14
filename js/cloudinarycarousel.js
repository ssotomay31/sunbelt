document.addEventListener("DOMContentLoaded", () => {
    const cloudinaryBaseURL = "https://res.cloudinary.com/dnculoaat/image/upload/carousel/";

    const images = [
        cloudinaryBaseURL + "carousel1.jpg",
        cloudinaryBaseURL + "carousel2.jpg",
        cloudinaryBaseURL + "carousel3.jpg",
    ];

    const carousel = document.getElementById("projectCarousel");
    const dotsContainer = document.getElementById("carouselDots");
    let currentSlide = 0;
    const slideInterval = 5000; // Auto-scroll interval in milliseconds

    // Load Images into Carousel
    function loadCarousel() {
        carousel.innerHTML = images
            .map(
                (src, index) =>
                    `<div class="carousel-slide ${
                        index === currentSlide ? "active" : ""
                    }">
                        <img src="${src}" alt="Project ${index + 1}" loading="lazy">
                    </div>`
            )
            .join("");

        dotsContainer.innerHTML = images
            .map(
                (_, index) =>
                    `<span class="carousel-dot ${
                        index === currentSlide ? "active" : ""
                    }" data-index="${index}"></span>`
            )
            .join("");

        // Add event listeners to dots
        const dots = document.querySelectorAll(".carousel-dot");
        dots.forEach((dot) => {
            dot.addEventListener("click", () => {
                currentSlide = parseInt(dot.getAttribute("data-index"));
                updateCarousel();
            });
        });
    }

    // Update Carousel Display
    function updateCarousel() {
        const slides = document.querySelectorAll(".carousel-slide");
        const dots = document.querySelectorAll(".carousel-dot");

        slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === currentSlide);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentSlide);
        });
    }

    // Auto-scroll function
    function autoScroll() {
        currentSlide = (currentSlide + 1) % images.length;
        updateCarousel();
    }

    // Initialize
    loadCarousel();
    setInterval(autoScroll, slideInterval);
});