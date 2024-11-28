const completedActionsStore = require('../services/completedActionsStore');
const axios = require('axios');

exports.sendToDevice = async (actionDetails) => {
    try {
        // Destructure actionDetails, defaulting mthd to 'POST' if it is not provided
        const { href, op, contentType, actionId, mthd = 'POST' } = actionDetails;

        console.log(`Preparing to send action:`, {
            href,
            operation: op,
            method: mthd,
            contentType,
            actionId
        });

        // Configure the request payload and options
        const options = {
            method: mthd, // Use the method, defaulting to POST if missing
            url: href,
            headers: {
                'Content-Type': contentType
            },
            data: { actionId, operation: op } // Payload for methods like POST/PUT
        };

        // Adjust options for methods that don't require a payload
        if (mthd === 'GET' || mthd === 'DELETE') {
            delete options.data; // Remove data for GET or DELETE
        }

        // Send the request to the device
        const response = await axios(options);

        // Save the response to the store
        completedActionsStore[actionId] = {
            status: 'success',
            response: response.data
        };

        console.log('Device response:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error during device communication:', error.message || error);

        // Save the error to the store
        completedActionsStore[actionId] = {
            status: 'failure',
            error: error.message
        };

        throw new Error('Device communication failed');
    }
};
