const fs = require('fs').promises;
const Papa = require('papaparse');
const path = require('path');

// Function to read a CSV file
async function readCsvFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return new Promise((resolve, reject) => {
            Papa.parse(data, {
                header: true,
                complete: (results) => resolve(results.data),
                error: (error) => reject(error),
            });
        });
    } catch (error) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
}

// Function to modify URLs in a CSV file
function modifyUrlsInCsv(data, urlColumnName, modifyUrlFn) {
    return data.map(row => {
        if (row[urlColumnName]) {
            row['Modified URL'] = modifyUrlFn(row[urlColumnName]);
        }
        return row;
    });
}

// Function to convert data back to CSV
function convertToCsv(data) {
    return Papa.unparse(data);
}

// Function to write a CSV file
async function writeCsvFile(filePath, content) {
    try {
        await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
        throw new Error(`Failed to write file: ${error.message}`);
    }
}

// Example URL modification function
function modifyUrl(url) {
    // Example: Append a query parameter
    return url + '?modified=true';
}

// Main function to handle file input and processing
async function processCsvFile(inputFilePath, outputFilePath) {
    try {
        const csvData = await readCsvFile(inputFilePath);
        const modifiedData = modifyUrlsInCsv(csvData, 'URL', modifyUrl);
        const newCsvContent = convertToCsv(modifiedData);
        await writeCsvFile(outputFilePath, newCsvContent);
        console.log(`File has been processed and saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing CSV file:', error);
    }
}

// Example usage
const inputFilePath = path.join(__dirname, 'input.csv');
const outputFilePath = path.join(__dirname, 'modified_urls.csv');

processCsvFile(inputFilePath, outputFilePath);
