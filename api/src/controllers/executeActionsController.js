const IoTService = require('../services/IotService');
const IoTController = require('./IotController');

exports.handleFrontendPost = async (req, res) => {
    try {
        console.log("Received frontend POST request:", req.body);

        const { actionId, humanReadableAction } = req.body;

        if (!actionId || !humanReadableAction) {
            console.error("Validation failed: Missing actionId or humanReadableAction");
            return res.status(400).json({ error: "Missing actionId or humanReadableAction" });
        }

        // Retrieve action details from mainDataStorage
        console.log("Retrieving action details for:", { actionId, humanReadableAction });
        const actionDetails = IoTService.getActionDetails(actionId, humanReadableAction);

        if (!actionDetails) {
            console.error("No action details found for:", { actionId, humanReadableAction });
            return res.status(404).json({ error: "Action not found" });
        }

        console.log("Action details retrieved:", actionDetails);

        // Respond to the frontend immediately
        res.json({ status: "Action received and processing started" });

        // Process the action asynchronously
        try {
            const deviceResponse = await IoTController.sendToDevice(actionDetails);
            console.log("Device response:", deviceResponse);
        } catch (deviceError) {
            console.error("Error sending to device:", deviceError);
        }
    } catch (error) {
        console.error("Error handling frontend POST request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
