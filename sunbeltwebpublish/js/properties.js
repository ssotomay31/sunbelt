async function loadProperties() {
    try {
        const response = await fetch('../data/sunbelt.csv'); // Load CSV data
        const data = await response.text();
        const properties = parseCSV(data);

        console.log('Properties Loaded:', properties);

        // Sort properties: "Current" first alphabetically, then by year (newest first)
        properties.sort((a, b) => {
            const yearA = a.year.toLowerCase() === "current" ? Infinity : parseInt(a.year) || -Infinity;
            const yearB = b.year.toLowerCase() === "current" ? Infinity : parseInt(b.year) || -Infinity;

            if (yearA === yearB) {
                return a.name.localeCompare(b.name); // Alphabetical sorting for same years
            }
            return yearB - yearA; // Sort by year (newest first)
        });

        console.log("Sorted Properties for Display:", properties);
        
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

function parseCSV(data) {
    const rows = data.split('\n').map(row => row.trim()).filter(row => row); // Remove empty rows
    const headers = rows[0].split(',').map(h => h.trim()); // Get headers from first row
    const nameIndex = headers.indexOf("name");
    const imgIndex = headers.indexOf("img");

    return rows.slice(1).map(row => {
        const columns = row.split(',').map(col => col.trim());

        if (columns.length < headers.length) return null; // Skip invalid rows

        const name = columns[nameIndex] || 'Unnamed Property';
        const img = columns[imgIndex] ? columns[imgIndex].toLowerCase().replace(/\s+/g, '') : 'default.jpg';

        return {
            name,
            city: columns[headers.indexOf("city")] || "N/A",
            size: columns[headers.indexOf("size")] || "N/A",
            description: columns[headers.indexOf("description")] || "N/A",
            year: columns[headers.indexOf("year")] || "N/A",
            img
        };
    }).filter(item => item);
}

function displayProperties(properties) {
    const propertiesGrid = document.getElementById('propertiesGrid');
    if (!propertiesGrid) {
        console.error("Error: 'propertiesGrid' element not found.");
        return;
    }

    propertiesGrid.innerHTML = ""; // Clear previous content

    const cloudinaryBaseURL = "https://res.cloudinary.com/dnculoaat/image/upload/property_img/";

    properties.forEach(property => {
        const formattedName = property.name.trim(); // Ensure full name is used
        const formattedImg = property.img ? property.img.trim() : "default.jpg";
        const imagePath = `${cloudinaryBaseURL}${formattedImg}`;

        // Property Page
        const propertyPage = `../properties/${formattedName.replace(/\s+/g, '').toLowerCase()}.html`;

        // Create property card
        const card = document.createElement('div');
        card.classList.add('property-card');

        card.innerHTML = `
            <a href="${propertyPage}" class="property-link">
                <div class="property-image-container">
                    <img 
                        src="${imagePath}" 
                        alt="${formattedName}" 
                        class="property-image"
                        onerror="this.onerror=null; this.src='${cloudinaryBaseURL}default.jpg';" 
                    >
                </div>
            </a>
            <div class="property-details">
                <h3>
                    <a href="${propertyPage}" class="property-title-link">${formattedName}</a>
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