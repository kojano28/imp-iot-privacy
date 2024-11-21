const thingDescriptionService = require('../services/thingDescriptionService');
const analysisService = require('../services/analysisService');
const axios = require('axios'); // Import axios for HTTP requests

// In-memory cache for storing analysis results
const analysisCache = new Map();

const onDeviceFound = async (deviceInfo) => {
    const { ip, port, thingDescription } = deviceInfo;
    const dataservice_url = `http://${ip}:${port}`;

    try {
        // Since we already have the Thing Description, we can use it directly
        const td = thingDescription;

        // Fetch the Privacy Policy using dataservice_url
        const privacyPolicy = await thingDescriptionService.getPrivacyPolicy(dataservice_url);

        // Analyze the TD and Privacy Policy
        const analysis = await analysisService.analyze(td, privacyPolicy);

        // Ensure no duplicate actions are added
        const existingResults = analysisCache.get(dataservice_url) || { analysis: [] };

        const updatedAnalysis = analysis.filter(newAction => {
            // Check for duplicates in the existing cache
            const isDuplicate = existingResults.analysis.some(
                existingAction =>
                    existingAction.action.humanReadableAction === newAction.action.humanReadableAction
            );
            return !isDuplicate;
        });

        if (updatedAnalysis.length === 0) {
            console.log(`No new actions to add for ${dataservice_url}`);
            return;
        }

        // Add new actions to the existing cache entry (if it exists)
        const mergedAnalysis = [
            ...existingResults.analysis,
            ...updatedAnalysis.map(item => ({
                ...item,
                dataservice_url: dataservice_url // Ensure the dataservice_url is added
            }))
        ];

        // Update the cache
        analysisCache.set(dataservice_url, { analysis: mergedAnalysis });

        console.log(`Updated cache for ${dataservice_url}:`, mergedAnalysis);

    } catch (error) {
        console.error(`Error processing device at ${dataservice_url}:`, error.message);
    }
};

const getTDactions = async (req, res) => {
    try {
        const { dataservice_url } = req.body;

        if (!dataservice_url) {
            return res.status(400).json({ error: 'dataservice_url is required' });
        }

        // Retrieve the cached result
        const cachedResult = analysisCache.get(dataservice_url);

        if (!cachedResult) {
            return res.status(404).json({ error: 'Analysis not found for the given dataservice_url' });
        }

        // Extract the actions
        const tdActions = cachedResult.analysis.map(item => item.action);

        // Prepare data to send to the Hololens
        const dataToSend = {
            dataservice_url,
            actions: tdActions
        };

        // Send the data to the Hololens
        try {
            await sendToHololens(dataToSend);
            console.log(`Send actions from  ${dataservice_url}: to HoloLens`);
        } catch (error) {
            console.error('Failed to send data to Hololens:', error.message);
            return res.status(500).json({ error: 'Failed to send data to Hololens' });
        }

        // Return the actions to the client
        res.json({ dataservice_url, actions: tdActions });
    } catch (error) {
        console.error('Error retrieving TD actions from cache:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const sendToHololens = async (data, retries = 3) => {
    const hololensEndpoint = 'http://api:8090/api/getActions/sendToHololens'; // Replace with actual Hololens IP and endpoint
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(hololensEndpoint, data);
            console.log('JSON successfully sent to the Hololens:', response.data);
            return;
        } catch (error) {
            console.error(`Attempt ${attempt} - Error sending JSON to the Hololens:`, error.message);
            if (attempt === retries) throw error;
            // Wait before retrying
            await new Promise(res => setTimeout(res, 1000 * attempt));
        }
    }
};

module.exports = { onDeviceFound, getTDactions };
