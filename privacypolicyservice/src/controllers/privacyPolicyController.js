const PrivacyPolicy = require('../models/privacyPolicyModel');
const dpvOntologyService = require('../services/dpvOntologyService');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

// Helper function to call Hugging Face API
async function analyzeWithHuggingface(text) {
    const API_URL = 'https://api-inference.huggingface.co/models/dslim/bert-base-NER';  // Change to a more suitable model
    const API_TOKEN = process.env.HUGGINGFACE_API_KEY;

    // Function to split the text into smaller chunks (500 tokens per chunk)
    function splitTextIntoChunks(text, maxLength = 500) {
        const chunks = [];
        const words = text.split(' ');  // Split text into words
        let currentChunk = [];

        for (let word of words) {
            if (currentChunk.join(' ').length + word.length <= maxLength) {
                currentChunk.push(word);
            } else {
                chunks.push(currentChunk.join(' '));
                currentChunk = [word];
            }
        }

        // Add any remaining text as the last chunk
        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));
        }

        return chunks;
    }

    // Split the text into chunks
    const textChunks = splitTextIntoChunks(text, 512);  // Use 512 tokens max for BERT-based models

    // Send each chunk to Hugging Face API and aggregate results
    let nlpResults = [];
    for (let chunk of textChunks) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: chunk,  // Send the chunk instead of the full text
            }),
        });

        const result = await response.json();
        if (result.error) {
            throw new Error(`Error from Hugging Face API: ${result.error}`);
        }

        nlpResults = [...nlpResults, ...result];  // Aggregate results from all chunks
    }

    return nlpResults;
}
// Function to map NLP result to DPV ontology fields using extracted DPV terms
function mapToDPVOntology(nlpResult, dpvFields) {
    const mappedDpv = {
        dataCategories: [],
        processingActivities: [],
        legalBases: []
    };

    nlpResult.forEach(entity => {
        const entityWord = entity.word.toLowerCase().trim();

        // Try a more flexible matching by checking for partial matches and synonyms
        if (dpvFields.personalDataCategories.some(category => entityWord.includes(category.toLowerCase()))) {
            mappedDpv.dataCategories.push(entityWord);
        }
        if (dpvFields.processingActivities.some(activity => entityWord.includes(activity.toLowerCase()))) {
            mappedDpv.processingActivities.push(entityWord);
        }
        if (dpvFields.legalBases.some(base => entityWord.includes(base.toLowerCase()))) {
            mappedDpv.legalBases.push(entityWord);
        }
    });

    return mappedDpv;
}


// Controller: Get Privacy Policy by Device Name and analyze it with Hugging Face and DPV ontology matching
exports.getPrivacyPolicyByDeviceName = async (req, res) => {
    const { deviceName } = req.query;

    try {
        // Fetch the privacy policy from the database
        let policy = await PrivacyPolicy.findOne({ deviceName: deviceName });
        let policyContent;

        if (!policy || !policy.policyContent) {
            // Policy not found in DB, read directly from the file system
            console.log(`Policy content not found in DB for device: ${deviceName}, reading from file...`);

            const filePath = path.join(__dirname, '../../data/privacypolicies', `${deviceName}.html`);
            try {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const $ = cheerio.load(fileContent);
                policyContent = $('body').text().trim();

                if (!policyContent) {
                    throw new Error('No content found in the file');
                }
                console.log(`Read content from file ${filePath}:`, policyContent.substring(0, 100)); // Log first 100 chars

            } catch (fileError) {
                console.error(`Error reading file for device ${deviceName}:`, fileError.message);
                return res.status(500).json({ message: `Error reading file for device ${deviceName}`, error: fileError.message });
            }
        } else {
            // Use the policy from the DB
            policyContent = policy.policyContent;
            console.log('Policy content found in DB:', policyContent.substring(0, 100)); // Log first 100 chars
        }


        // Analyze policy content using Hugging Face NLP model
        const nlpResult = await analyzeWithHuggingface(policyContent);

        // Get DPV fields from the ontology service
        const dpvFields = await dpvOntologyService.getDPVFields();

        // Map NLP results to DPV ontology
        const dpvMapping = mapToDPVOntology(nlpResult, dpvFields);

        // Log the filled DPV parameters
        console.log('Filled DPV Parameters:');
        console.log('Data Categories:', dpvMapping.dataCategories);
        console.log('Processing Activities:', dpvMapping.processingActivities);
        console.log('Legal Bases:', dpvMapping.legalBases);

        res.json({
            deviceName: deviceName,
            policyContent: policyContent,
            nlpResult: nlpResult,
            dpvMapping: dpvMapping,  // Return mapped DPV results
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

