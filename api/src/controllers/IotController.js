const completedActionsStore = require('../services/completedActionsStore');
const axios = require('axios');
const DigestClient = require('http-digest-auth');
const digestClient = new DigestClient('hololens', 'your_password');

const response = await digestClient.request(href, {
    method,
    headers: { 'Content-Type': contentType },
    data,
});
exports.sendToDevice = async (actionDetails) => {
    try {
        const {
            href,
            contentType,
            actionId,
            title,
            humanReadableAction,
        } = actionDetails;

        console.log(`Preparing to send request:`, { href, contentType, actionId });

        // Hardcoded mappings for specific hrefs to corresponding actions
        const curlMapping = {
            "http://192.168.1.64/ISAPI/Streaming/channels/101-muteAudio": {
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
                requiresDigest: true, // Indicate Digest Authentication is required
            },
            "http://192.168.1.64/ISAPI/ContentMgmt/record/control/manual/stop/tracks/1-stopRecording": {
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
            "http://192.168.1.64/ISAPI/Streaming/channels/101-turnOff": {
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
            "http://192.168.1.101/api/ZylXTWF6CC6Wxh-HMWKNPPbV7n8DTNLNnibDhuCm/lights/4/state-hueLampOnOff": {
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify({
                    on: false, // Turn off the Hue Lamp
                }),
                requiresDigest: false, // Digest Authentication not required
            },
        };

        // Map href to a hardcoded action
        const actionKey = `${href}-${humanReadableAction}`;
        if (!curlMapping[actionKey]) {
            throw new Error(`No hardcoded curl mapping found for href: ${href} and action: ${humanReadableAction}`);
        }

        const { method, data, requiresDigest } = curlMapping[actionKey];

        // Prepare the request options
        const requestOptions = {
            method,
            url: href,
            headers: { 'Content-Type': contentType || curlMapping[actionKey].contentType },
            data: method === 'POST' || method === 'PUT' ? data.trim() : null,
        };

        // Use Digest Authentication or standard Axios request based on the mapping
        const response = requiresDigest
            ? await digestAuth.request(requestOptions) // Use Digest Authentication
            : await axios(requestOptions); // Standard Axios request

        // Determine success based on status code
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
