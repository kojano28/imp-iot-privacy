const completedActionsStore = require('../services/completedActionsStore');
const axios = require('axios');
const { makeDigestRequest } = require('../services/digestAuth');

// Function to send an action to a device
exports.sendToDevice = async (actionDetails) => {
    try {
        const { href, contentType, actionId, title, humanReadableAction } = actionDetails;

        console.log(`Preparing to send request:`, { href, contentType, actionId });

        // Hardcoded mappings for specific actions
        const curlMapping = {
            "http://192.168.1.64/ISAPI/Streaming/channels/101": {
                method: "PUT",
                contentType: "application/xml",
                data: `
                <?xml version="1.0" encoding="UTF-8"?>
                <StreamingChannel>
                    <id>101</id>
                    <Audio>
                        <enabled>false</enabled>
                    </Audio>
                </StreamingChannel>
                `,
                requiresDigest: true, // Digest Authentication required
            },
            "http://192.168.1.64/ISAPI/ContentMgmt/record/control/manual/stop/tracks/1": {
                method: "POST",
                contentType: "application/xml",
                data: `
                <?xml version="1.0" encoding="UTF-8"?>
                <ManualRecordStop>
                    <id>1</id>
                </ManualRecordStop>
                `,
                requiresDigest: true,
            },
            "http://192.168.1.64/ISAPI/Streaming/channels/101": {
                method: "PUT",
                contentType: "application/xml",
                data: `
                <?xml version="1.0" encoding="UTF-8"?>
                <StreamingChannel>
                    <id>101</id>
                    <enabled>false</enabled>
                </StreamingChannel>
                `,
                requiresDigest: true,
            },
            "http://192.168.1.101/api/ZylXTWF6CC6Wxh-HMWKNPPbV7n8DTNLNnibDhuCm/lights/4/state": {
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify({
                    on: false, // Turn off the Hue Lamp
                }),
                requiresDigest: false, // Digest Authentication not required
            },
        };

        // Resolve action based on the mapping
        const actionKey = `${href}-${humanReadableAction}`;
        const mappedAction = curlMapping[actionKey];
        if (!mappedAction) {
            throw new Error(`No hardcoded curl mapping found for href: ${href} and action: ${humanReadableAction}`);
        }

        const { method, data, requiresDigest } = mappedAction;

        let response;
        if (requiresDigest) {
            // Use Digest Authentication for this action
            response = await makeDigestRequest({
                url: href,
                method,
                username: 'admin', // Replace with actual username
                password: 'Bradnheiss2022', // Replace with actual password
                data: data.trim(),
            });
        } else {
            // Use a standard Axios request for this action
            response = await axios({
                method,
                url: href,
                headers: { 'Content-Type': contentType || mappedAction.contentType },
                data: method === 'POST' || method === 'PUT' ? data.trim() : null,
            });
        }

        // Determine success based on the HTTP response
        const status = response.status >= 200 && response.status < 300 ? 'success' : 'failure';

        // Store the result in completedActionsStore
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

        // Handle error responses
        const status = 'failure';
        const errorCode = error.response?.status || 'unknown';

        completedActionsStore[actionId] = {
            status,
            response: {
                statusCode: errorCode,
                data: error.response?.data || 'No content',
            },
            actionId,
            title,
            humanReadableAction,
        };

        console.log(`Action stored with status: ${status}`);
        return { actionId, status };
    }
};
