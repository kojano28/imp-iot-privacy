// deviceProcessor.js
const thingDescriptionService = require('../services/thingDescriptionService');
const analysisService = require('../services/analysisService');

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

// Function to retrieve analysis results from the cache
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

        // Return the actions to the client
        res.json({ dataservice_url, actions: tdActions });
    } catch (error) {
        console.error('Error retrieving TD actions from cache:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { onDeviceFound, getTDactions };