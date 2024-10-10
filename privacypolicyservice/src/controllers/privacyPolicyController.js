const PrivacyPolicy = require('../models/privacyPolicyModel');
const dpvOntologyService = require('../services/dpvOntologyService');
const fetch = require('node-fetch');


// Helper function to call Huggingface API
async function analyzeWithHuggingface(text) {
    if (!text) {
        throw new Error('Input text is undefined');
    }
    const API_URL = 'https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english';
    const API_TOKEN = process.env.HUGGINGFACE_API_KEY;

    if (!text) {
        throw new Error('Input text is undefined');
    }

    const inputText = String(text);

    // Log inputText after assignment
    console.log('inputText:', inputText);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: inputText,
        }),
    });

    const result = await response.json();
    console.log('Hugging Face API Result:', result);

    return result;
}



// Function to map NLP result to DPV ontology fields using extracted DPV terms
function mapToDPVOntology(nlpResult, dpvFields) {
    const ontologyMapping = {
        dataCategories: [],
        processingActivities: [],
        legalBases: []
    };

    // Assuming nlpResult contains an 'entities' array
    if (Array.isArray(nlpResult.entities)) {
        nlpResult.entities.forEach(entity => {
            // Compare the extracted entities with DPV categories
            if (dpvFields.personalDataCategories.includes(entity.word)) {
                ontologyMapping.dataCategories.push(entity.word);
            }
            if (dpvFields.processingActivities.includes(entity.word)) {
                ontologyMapping.processingActivities.push(entity.word);
            }
            if (dpvFields.legalBases.includes(entity.word)) {
                ontologyMapping.legalBases.push(entity.word);
            }
        });
    } else {
        console.error("Unexpected NLP result structure:", nlpResult);
    }

    return ontologyMapping;
}

// Controller: Get Privacy Policy by Device Name and analyze it with Huggingface and DPV ontology matching
exports.getPrivacyPolicyByDeviceName = async (req, res) => {
    const { deviceName } = req.query;

    try {
        const policy = await PrivacyPolicy.findOne({ deviceName: deviceName });
        if (!policy) {
            return res.status(404).json({ message: 'Privacy policy not found for device: ' + deviceName });
        }

        // Check if policy content is a string
        const policyContent = String(policy.policyContent);  // Ensure it's a string
        console.log('Policy Content Type:', typeof policyContent);

        // Analyze policy content using Huggingface NLP model
        // Ensure that policy.policyContent is passed to the function
        const nlpResult = await analyzeWithHuggingface(policy.policyContent);

        console.log('NER Output:', nlpResult);

        if (nlpResult.error) {
            console.error("Unexpected NLP result structure:", nlpResult);
            return res.status(500).json({ message: 'NLP analysis failed: ' + nlpResult.error });
        }

        // Get DPV fields
        const dpvFields = await dpvOntologyService.getDPVFields();

        // Map the result to DPV ontology using the extracted fields
        const dpvMapping = mapToDPVOntology(nlpResult, dpvFields);

        console.log("Mapped DPV Values:");
        console.log("Data Categories:", dpvMapping.dataCategories);
        console.log("Processing Activities:", dpvMapping.processingActivities);
        console.log("Legal Bases:", dpvMapping.legalBases);

        res.json({
            deviceName: deviceName,
            policyContent: policy.policyContent,
            dpvMapping: dpvMapping,
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

