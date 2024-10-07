// src/controllers/crawlerController.js

const webCrawlerService = require('../services/webCrawlerService');

// Make sure the function exists
exports.crawlPrivacyPolicy = async (req, res) => {
    const { productName } = req.query;

    if (!productName) {
        return res.status(400).json({ message: 'Product name is required' });
    }

    try {
        const policyUrl = await webCrawlerService.searchPrivacyPolicyOnWeb(productName);
        res.status(200).json({ message: 'Privacy policy found', url: policyUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// src/controllers/crawlerController.js

const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const PrivacyPolicy = require('../models/privacyPolicyModel');

/**
 * Function to read PDF files from the data folder, convert them to text, and store them in MongoDB.
 * Logs the stored policies to the console.
 */
exports.storePrivacyPolicies = async () => {
    const directoryPath = path.join(__dirname, '../../data/privacypolicies');

    try {
        // Read all files from the directory
        const files = await fs.readdir(directoryPath);

        const policiesStored = [];

        for (const file of files) {
            const filePath = path.join(directoryPath, file);

            // Only process PDF files
            if (path.extname(file) === '.pdf') {
                const fileBuffer = await fs.readFile(filePath);

                // Parse the PDF to extract text
                const parsedPDF = await pdfParse(fileBuffer);
                const fileContent = parsedPDF.text;  // Extract the text content from the PDF

                // Remove the .pdf extension from the filename
                const deviceName = path.basename(file, '.pdf');

                // Check if the policy already exists before storing it
                const existingPolicy = await PrivacyPolicy.findOne({ deviceName: deviceName });
                if (!existingPolicy) {
                    // Store the policy in MongoDB
                    const newPolicy = new PrivacyPolicy({
                        deviceName: deviceName,     // Store without .pdf extension
                        policyContent: fileContent  // Store extracted text
                    });

                    await newPolicy.save();
                    policiesStored.push(deviceName);  // Track stored policies

                    // Log which policies are being stored
                    console.log(`Stored policy for device: ${deviceName}`);
                } else {
                    console.log(`Policy for device ${deviceName} already exists, skipping.`);
                }
            } else {
                console.log(`Skipping non-PDF file: ${file}`);
            }
        }

        console.log('Policies stored successfully:', policiesStored);
    } catch (error) {
        console.error('Error storing privacy policies:', error.message);
    }
};
