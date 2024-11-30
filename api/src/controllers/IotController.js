const completedActionsStore = require('../services/completedActionsStore');
const axios = require('axios');

exports.sendToDevice = async (actionDetails) => {
    try {
        const {
            href,
            op,
            contentType = 'application/json',
            actionId,
            mthd = 'POST',
        } = actionDetails;

        console.log(`Preparing to send request:`, { href, method: mthd, contentType, actionId });

        // Construct the device payload (excluding actionId)
        const devicePayload = { operation: op };

        const options = {
            method: mthd,
            url: href,
            headers: { 'Content-Type': contentType },
            data: mthd === 'POST' || mthd === 'PUT' ? devicePayload : null,
        };

        // Send the request to the device
        const response = await axios(options);

        // Check the status code range for success (2xx)
        const status = response.status >= 200 && response.status < 300 ? 'success' : 'failure';

        // Store the result in completedActionsStore
        completedActionsStore[actionId] = {
            status,
            response: {
                statusCode: response.status,
                data: response.data || 'No content',
            },
        };

        console.log(`Action stored with status: ${status}`);
        return { actionId, status };

    } catch (error) {
        console.error('Error during communication:', error.message || error);

        // Check if the error has a response (e.g., 4xx, 5xx)
        const status = 'failure';
        const errorCode = error.response?.status || 'unknown';

        completedActionsStore[actionId] = {
            status,
            response: {
                statusCode: response.status,
                data: response.data || 'No content',
            },
            actionId, // Include the action ID
            title: actionDetails.title, // Add title from frontend
            humanReadableAction: actionDetails.humanReadableAction, // Add human-readable message from frontend
        };


        console.log(`Action stored with status: ${status}`);
        return { actionId, status };
    }
};
