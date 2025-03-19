document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("fullscreenImage");
    const captionText = document.getElementById("caption");
    const closeModal = document.querySelector(".close");

    if (!modal || !modalImage || !captionText || !closeModal) {
        console.error("❌ ERROR: Modal elements not found in the DOM. Check HTML structure.");
        return;
    }

    // Function to open the modal with the clicked image
    document.querySelectorAll(".gallery-item img").forEach(img => {
        img.addEventListener("click", function () {
            modal.style.display = "block";
            modalImage.src = this.src;
            captionText.innerText = this.alt || "Image Preview";
        });
    });

    // Close the modal when clicking the close button
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside the image
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});