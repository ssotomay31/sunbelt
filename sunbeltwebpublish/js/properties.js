async function loadProperties() {
    try {
        const response = await fetch('../data/sunbelt.csv'); // Load CSV data
        const data = await response.text();
        const properties = parseCSV(data);

        console.log('Properties Loaded:', properties);

        // Sort properties: "Current" first (alphabetically), then by year (newest to oldest)
        properties.sort((a, b) => {
            const yearA = a.year.toLowerCase() === "current" ? Infinity : parseInt(a.year) || 0;
            const yearB = b.year.toLowerCase() === "current" ? Infinity : parseInt(b.year) || 0;

            // If both are "Current", sort alphabetically
            if (yearA === Infinity && yearB === Infinity) {
                return a.name.localeCompare(b.name);
            }

            // Otherwise, sort by year (newest first)
            return yearB - yearA;
        });

        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

function parseCSV(data) {
    const rows = data.split('\n').slice(1); // Remove header row
    return rows.map(row => {
        const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); // Match values between quotes or unquoted
        if (!columns) return null; // Handle empty or malformed rows
        const [name, city, size, description, year, img] = columns.map(col => col.replace(/^"|"$/g, '').trim());
        return { name, city, size, description, year, img };
    }).filter(item => item); // Filter out null or invalid rows
}

function displayProperties(properties) {
    const propertiesGrid = document.getElementById('propertiesGrid');
    if (!propertiesGrid) {
        console.error("Error: 'propertiesGrid' element not found.");
        return;
    }

    propertiesGrid.innerHTML = ""; // Clear previous content before adding sorted items

    properties.forEach(property => {
        const cloudinaryBaseURL = "https://res.cloudinary.com/dnculoaat/image/upload/v1739403117/property_img/";

        const imagePath = property.img && property.img !== 'blank'
            ? `${cloudinaryBaseURL}${property.img}`
            : `${cloudinaryBaseURL}default.jpg`;

        const propertyPage = `../properties/${property.name.replace(/\s+/g, '').toLowerCase()}.html`;

        const card = document.createElement('div');
        card.classList.add('property-card');

        card.innerHTML = `
            <a href="${propertyPage}" class="property-link">
                <div class="property-image-container">
                    <img 
                        src="${imagePath}" 
                        alt="${property.name}" 
                        class="property-image"
                        onerror="this.onerror=null; this.src='../images/property_img/default.jpg';" 
                    >
                </div>
            </a>
            <div class="property-details">
                <h3>
                    <a href="${propertyPage}" class="property-title-link">${property.name}</a>
                </h3>
                <p><strong>City:</strong> ${property.city || 'N/A'}</p>
                <p><strong>Size:</strong> ${property.size || 'N/A'}</p>
                <p><strong>Year:</strong> ${property.year || 'N/A'}</p>
            </div>
        `;

        propertiesGrid.appendChild(card);
    });
}

// Load properties on page load
document.addEventListener('DOMContentLoaded', loadProperties);