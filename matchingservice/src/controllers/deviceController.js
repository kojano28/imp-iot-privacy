const { fetchThingDescription } = require('../services/thingDescriptionService');
const { analyzeThingDescription } = require('../services/thingDescriptionService');

async function getDeviceThingDescription(req, res) {
    try {
        const deviceUrl = req.params.deviceUrl;
        const thingDescription = await fetchThingDescription(deviceUrl);
        const analysis = analyzeThingDescription(thingDescription);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching or analyzing Thing Description' });
    }
}

module.exports = { getDeviceThingDescription };
