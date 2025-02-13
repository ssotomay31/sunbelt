const fs = require('fs');
const path = require('path');

// File paths
const inputFilePath = path.join(__dirname, 'sunbelt.csv');
const outputFilePath = path.join(__dirname, 'sunbelt_fixed.csv');

// Read the CSV file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`❌ Error reading file: ${err.message}`);
        return;
    }

    // Remove ALL quotes and fix city, state format
    let cleanedData = data
        .replace(/"/g, '')  // Remove all quotes
        .replace(/, TX/g, ' TX')  // Remove comma between city and state
        .replace(/, CA/g, ' CA')  
        .replace(/, FL/g, ' FL')  
        .replace(/, NY/g, ' NY')  
        .replace(/, IL/g, ' IL')  
        .replace(/, CO/g, ' CO')  
        .replace(/, AZ/g, ' AZ')  
        .replace(/, GA/g, ' GA');  

    // Save the cleaned file
    fs.writeFile(outputFilePath, cleanedData, (err) => {
        if (err) {
            console.error(`❌ Error writing file: ${err.message}`);
            return;
        }
        console.log(`✅ Cleaned CSV saved at: ${outputFilePath}`);
    });
});