const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');

// Define input and output file paths
const inputFilePath = path.join(__dirname, 'sunbelt.csv');
const outputFilePath = path.join(__dirname, 'sunbelt_fixed.csv');

// Read CSV file
const properties = [];

fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
        if (row.name && row.year && row.img !== 'blank') {
            row.img = row.name.toLowerCase().replace(/\s+/g, '') + '.jpg'; // Normalize image name
        } else {
            row.img = 'default.jpg'; // Fallback if no image is provided
        }
        properties.push(row);
    })
    .on('end', () => {
        // Sort properties: "Current" first (alphabetically), then by year (newest to oldest)
        properties.sort((a, b) => {
            const yearA = a.year.toLowerCase() === "current" ? Infinity : parseInt(a.year) || -Infinity;
            const yearB = b.year.toLowerCase() === "current" ? Infinity : parseInt(b.year) || -Infinity;

            if (yearA === Infinity && yearB === Infinity) {
                return a.name.localeCompare(b.name); // Alphabetical order for "Current"
            }
            return yearB - yearA; // Sort by year (newest first)
        });

        // Convert back to CSV and write file
        const csvData = parse(properties);
        fs.writeFileSync(outputFilePath, csvData);
        console.log(`CSV file successfully updated and saved as ${outputFilePath}`);
    });