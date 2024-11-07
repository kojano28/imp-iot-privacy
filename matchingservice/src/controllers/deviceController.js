// deviceController.js
const analysisService = require('../services/analysisService');
const thingDescriptionService = require('../services/thingDescriptionService');
const axios = require('axios');

exports.analyzeDevice = async (req, res) => {
    try {
        const { dataservice_url } = req.body;

        if (!dataservice_url) {
            return res.status(400).json({ error: 'dataservice_url is required' });
        }

        // Pass the dataservice_url dynamically to thingDescriptionService
        const td = await thingDescriptionService.getThingDescription(dataservice_url);
        const privacyPolicy = await thingDescriptionService.getPrivacyPolicy(dataservice_url);

        const analysis = await analysisService.analyze(td, privacyPolicy);

        // Add deviceIP to each action in the analysis
        const analysisWithDATASERVICE_URL = analysis.map(item => ({
            ...item,
            dataservice_url: dataservice_url
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