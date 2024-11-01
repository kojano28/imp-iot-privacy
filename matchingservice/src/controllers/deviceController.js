// deviceController.js
const analysisService = require('../services/analysisService');
const thingDescriptionService = require('../services/thingDescriptionService');

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

        res.json({ analysis });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
