const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const PrivacyPolicy = require('../models/privacyPolicyModel');
const cheerio = require('cheerio');

// Core function to store privacy policies
async function storePrivacyPolicies() {
    const directoryPath = path.join(__dirname, '../../data/privacypolicies');

    try {
        // Read all files from the directory
        const files = await fs.readdir(directoryPath);

        const policiesStored = [];

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const fileExtension = path.extname(file);

            if (fileExtension === '.pdf') {
                const fileBuffer = await fs.readFile(filePath);
                const parsedPDF = await pdfParse(fileBuffer);
                const fileContent = parsedPDF.text;

                // Log the extracted PDF content
                console.log(`Extracted content from PDF ${file}:`, fileContent.substring(0, 100));  // Log first 100 chars

                const deviceName = path.basename(file, '.pdf');
                await storePolicy(deviceName, fileContent, policiesStored);

            } else if (fileExtension === '.html') {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const $ = cheerio.load(fileContent);
                const htmlText = $('body').text();

                // Log the extracted HTML content
                console.log(`Extracted content from HTML ${file}:`, htmlText.substring(0, 100));  // Log first 100 chars

                const deviceName = path.basename(file, '.html');
                await storePolicy(deviceName, htmlText, policiesStored);

            } else {
                console.log(`Skipping non-PDF/HTML file: ${file}`);
            }
        }

        console.log('Policies stored successfully:', policiesStored);

        // Return the stored policies for potential use
        return policiesStored;
    } catch (error) {
        console.error('Error storing privacy policies:', error.message);
        throw error;  // Re-throw the error to handle it in the calling function
    }
}

// Express route handler to store privacy policies
exports.storePrivacyPoliciesRoute = async (req, res) => {
    try {
        const policiesStored = await storePrivacyPolicies();
        res.status(200).json({ message: 'Policies stored successfully', policies: policiesStored });
    } catch (error) {
        res.status(500).json({ message: 'Error storing policies', error: error.message });
    }
};

// Helper function to store the policy in MongoDB if it doesn't already exist
async function storePolicy(deviceName, policyContent, policiesStored) {
    const existingPolicy = await PrivacyPolicy.findOne({ deviceName: deviceName });

    if (!existingPolicy) {
        const newPolicy = new PrivacyPolicy({
            deviceName: deviceName,
            policyContent: policyContent,
        });

        await newPolicy.save();
        policiesStored.push(deviceName);
        console.log(`Stored policy for device: ${deviceName}`);
    } else {
        console.log(`Policy for device ${deviceName} already exists, skipping.`);
    }
}

// Export the core function for use in app.js
exports.storePrivacyPolicies = storePrivacyPolicies;
