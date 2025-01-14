// Fullscreen Modal Setup for Gallery
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("fullscreenImage");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".modal .close");

    // Attach click events to gallery images
    document.querySelectorAll(".gallery-grid img").forEach((img) => {
        img.addEventListener("click", function () {
            modal.style.display = "block";
            modalImg.src = this.src; // Set the modal image source
            captionText.innerHTML = this.alt || "Image"; // Set caption text
        });
    });

    // Close modal on clicking the close button
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of the image
    modal.addEventListener("click", function (e) {
        if (e.target !== modalImg) {
            modal.style.display = "none";
        }
    });
});