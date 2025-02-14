const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const inputFilePath = path.join(__dirname, 'sunbelt.csv');

fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);  // ✅ Print each row to debug
    })
    .on('end', () => {
        console.log("✅ CSV file read successfully.");
    })
    .on('error', (err) => {
        console.error("❌ ERROR:", err);
    });