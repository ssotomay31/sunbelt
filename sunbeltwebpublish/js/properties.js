async function loadProperties() {
    try {
        // Fetch the CSV data
        const response = await fetch('../data/sunbelt.csv');
        const data = await response.text();

        // Parse and display properties
        const properties = parseCSV(data);
        console.log('Properties Loaded:', properties);
        displayProperties(properties);

        // Initialize the fullscreen modal after displaying properties
        setupGalleryModal();
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

function parseCSV(data) {
    // Split rows, skipping the header
    const rows = data.split('\n').slice(1);

    // Map rows to objects
    return rows
        .map(row => {
            const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); // Regex to handle CSV format
            if (!columns) return null;

            // Extract columns and trim whitespace/quotes
            const [name, city, size, description, year, img] = columns.map(col =>
                col.replace(/^"|"$/g, '').trim()
            );

            // Return a property object
            return { name, city, size, description, year, img };
        })
        .filter(item => item); // Filter out invalid rows
}

function displayProperties(properties) {
    const propertiesGrid = document.getElementById('propertiesGrid');

    // Loop through properties and create cards
    properties.forEach(property => {
        const imagePath = property.img && property.img !== 'blank'
            ? `../images/property_img/${property.img}`
            : '../images/property_img/default.jpg';

        const propertyPage = `../properties/${property.name.replace(/\s+/g, '').toLowerCase()}.html`;

        // Create a card for each property
        const card = document.createElement('div');
        card.classList.add('property-card');
        card.innerHTML = `
            <a href="${propertyPage}" class="property-link">
                <img 
                    src="${imagePath}" 
                    alt="${property.name}" 
                    class="property-image"
                    onerror="this.onerror=null; this.src='../images/property_img/default.jpg';"
                >
            </a>
            <div class="property-details">
                <h3>
                    <a href="${propertyPage}" class="property-title-link">${property.name}</a>
                </h3>
                <p>City: ${property.city || 'N/A'}</p>
                <p>Size: ${property.size || 'N/A'}</p>
                <p>Year: ${property.year || 'N/A'}</p>
            </div>
        `;

        // Append the card to the grid
        propertiesGrid.appendChild(card);
    });
}

function setupGalleryModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('fullscreenImage');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.modal .close');

    // Attach click events to all gallery images
    document.querySelectorAll('.gallery-grid img').forEach(img => {
        img.addEventListener('click', function () {
            modal.style.display = 'block';
            modalImg.src = this.src; // Set modal image
            captionText.innerHTML = this.alt || 'Image'; // Set modal caption
        });
    });

    // Close modal when the close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', e => {
        if (e.target !== modalImg) {
            modal.style.display = 'none';
        }
    });
}

// Initialize modal setup after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupGalleryModal();
});

// Load properties on page load
loadProperties();