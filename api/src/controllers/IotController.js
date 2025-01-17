require('dotenv').config(); // Load environment variables
const axios = require('axios');
const DeviceAdapters = require('../adapters/DeviceAdapters');
const completedActionsStore = require('../services/completedActionsStore');

exports.sendToDevice = async (actionDetails) => {
    try {
        const { href, contentType, actionId, title, humanReadableAction } = actionDetails;

        console.log(`Preparing to send request: ${actionId}, ${humanReadableAction}`);

// Select the adapter based on href or device type
        const adapter = DeviceAdapters.getAdapter(href);
        if (!adapter) {
            throw new Error(`No adapter found for href: ${href}`);
        }

// Determine the specific method to call based on the adapter type
        let response;
        if (typeof adapter.sendActionHue === 'function') {
            // If the adapter is a HueLampAdapter
            response = await adapter.sendActionHue({
                href,
                contentType,
                actionId,
            });
        } else if (typeof adapter.sendAction === 'function') {
            // For other adapters that use sendAction
            response = await adapter.sendAction({
                href,
                contentType,
                actionId,
            });
        } else {
            throw new Error(`Adapter for href: ${href} does not support a valid action method.`);
        }

        // Determine if the response is JSON or XML
        const contentTypeHeader = response.headers['content-type'] || '';
        let parsedResponse;

        if (contentTypeHeader.includes('application/json')) {
            // Parse JSON response
            parsedResponse = response.data;
        } else if (contentTypeHeader.includes('application/xml') || contentTypeHeader.includes('application/xml')) {
            // Parse XML response
            parsedResponse = await parseXML(response.data);
        } else {
            // Fallback to plain text
            parsedResponse = response.data;
        }

        // Determine success and store the result
        const status = response.status >= 200 && response.status < 300 ? 'success' : 'failure';

        completedActionsStore[actionId] = {
            status,
            actionId,
            title,
            humanReadableAction,
        };

        console.log(`Action executed successfully: ${actionId}`);
        return { actionId, status };
    } catch (error) {
        console.error(`Error executing action: ${error.message}`);

        completedActionsStore[actionId] = {
            status: 'failure',
            actionId,
            title,
            humanReadableAction,
        };

        return { actionId, status: 'failure' };
    }
};
