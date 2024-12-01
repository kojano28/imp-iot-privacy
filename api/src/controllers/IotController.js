const completedActionsStore = require('../services/completedActionsStore');
const axios = require('axios');

exports.sendToDevice = async (actionDetails) => {
    try {
        const {
            href,
            op,
            contentType = 'application/json',
            actionId,
            title,
            humanReadableAction,
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
        console.log("Storing action:", {
            actionId,
            title,
            humanReadableAction,
            status,
        });

        completedActionsStore[actionId] = {
            status,
            response: {
                statusCode: response.status,
                data: response.data || 'No content',
            },
            actionId,
            title,
            humanReadableAction,
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
                statusCode: errorCode,
                data: error.response?.data || 'No content',
            },
            actionId,
            title: actionDetails.title, // Ensure title is included
            humanReadableAction: actionDetails.humanReadableAction, // Ensure human-readable message is included
        };

        console.log(`Action stored with status: ${status}`);
        return { actionId, status };
    }
};

