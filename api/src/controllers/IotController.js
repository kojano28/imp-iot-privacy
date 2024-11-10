// IotController.js

const axios = require('axios');

// Function to send a POST request to the device using action details
exports.sendToDevice = async (actionDetails) => {
    try {
        const { href, op, contentType, actionId } = actionDetails;

        // Configure the request payload for the device
        const payload = { actionId, operation: op };

        // Send POST request to the device
        const response = await axios.post(href, payload, {
            headers: {
                'Content-Type': contentType
            }
        });

        // Return device response data
        return response.data;
    } catch (error) {
        console.error('Error communicating with device:', error);
        throw new Error('Device communication failed');
    }
};
