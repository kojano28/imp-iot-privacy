// InputController.js

const IotService = require('../services/IotService');
const IotController = require('./IotController');

// Handle incoming POST request from the frontend
exports.handleFrontendPost = async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log('Received request body:', req.body);

        const { actionId, humanReadableAction, DATASERVICE_URL } = req.body;

        // Validate required fields
        if (!actionId || !humanReadableAction) {
            return res.status(400).json({ error: 'Missing actionId or humanReadableAction' });
        }

        // Retrieve action details using the IotService
        const actionDetails = IotService.getActionDetails(actionId, humanReadableAction);

        if (!actionDetails) {
            return res.status(404).json({ error: 'Action not found' });
        }

        // Send the action details to the IotController for device interaction
        const deviceResponse = await IotController.sendToDevice(actionDetails);

        // Respond back to the frontend with the result
        res.json({ status: 'Action processed successfully', deviceResponse });
    } catch (error) {
        console.error('Error handling frontend POST request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
