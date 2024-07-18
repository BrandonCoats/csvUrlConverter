import Papa from 'papaparse';
import { saveAs } from 'file-saver';

// Function to read a CSV file
function readCsvFile(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
        });
    });
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

// Function to trigger CSV download
function downloadCsv(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
}

// Example URL modification function
function modifyUrl(url) {
    // Example: Append a query parameter
    return url + '?modified=true';
}

// Main function to handle file input and processing
async function handleFileInput(file) {
    try {
        const csvData = await readCsvFile(file);
        const modifiedData = modifyUrlsInCsv(csvData, 'URL', modifyUrl);
        const newCsvContent = convertToCsv(modifiedData);
        downloadCsv(newCsvContent, 'modified_urls.csv');
    } catch (error) {
        console.error('Error processing CSV file:', error);
    }
}

// Example usage: Suppose you have an input element of type file
document.getElementById('csvFileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        handleFileInput(file);
    }
});
