// deviceController.js
const analysisService = require('../services/analysisService');
const thingDescriptionService = require('../services/thingDescriptionService');
const axios = require('axios');

exports.analyzeDevice = async (req, res) => {
    try {
        const { DATASERVICE_URL } = req.body;

        if (!DATASERVICE_URL) {
            return res.status(400).json({ error: 'DATASERVICE_URL is required' });
        }

        // Pass the DATASERVICE_URL dynamically to thingDescriptionService
        const td = await thingDescriptionService.getThingDescription(DATASERVICE_URL);
        const privacyPolicy = await thingDescriptionService.getPrivacyPolicy(DATASERVICE_URL);

        const analysis = await analysisService.analyze(td, privacyPolicy);

        // Add deviceIP to each action in the analysis
        const analysisWithDATASERVICE_URL = analysis.map(item => ({
            ...item,
            DATASERVICE_URL: DATASERVICE_URL
        }));
        // Construct the result JSON
        const result = {
            analysis: analysisWithDATASERVICE_URL
        };

        // Log the final JSON
        console.log('Final JSON to be sent:', JSON.stringify(result, null, 2));

        // Send the JSON to the API service at http://localhost:8090
        try {
            await axios.post('http://api:8090/api/output/sendToHololens', result);
            console.log('JSON successfully sent to the API service.');
        } catch (postError) {
            console.error('Error sending JSON to the API service:', postError.message);
        }

        // Respond to the original request
        res.json({ message: 'Analysis completed and logged', data: result });

    } catch (error) {
        console.error('Error processing the request:', error.message);
        res.status(500).json({ error: error.message });
    }
};