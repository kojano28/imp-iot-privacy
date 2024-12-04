const { makeDigestRequest } = require('../services/digestAuth');

class CameraAdapter {
    constructor() {
        // Define the curlMapping for the camera
        this.curlMapping = {
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
                requiresDigest: true,
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
            "http://192.168.1.64/ISAPI/Streaming/channels/101-enabled": {
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
        };
    }

    async sendAction({ href }) {
        // Check if href exists in the curlMapping
        const config = this.curlMapping[href];
        if (!config) {
            throw new Error(`No mapping found for href: ${href}`);
        }

        const { method, contentType, data, requiresDigest } = config;

        if (requiresDigest) {
            // Use Digest Authentication
            const username = process.env.CAMERA_USERNAME; // From .env
            const password = process.env.CAMERA_PASSWORD; // From .env

            return await makeDigestRequest({
                url: href,
                method,
                username,
                password,
                data: data.trim(),
            });
        } else {
            // Standard request
            return await axios({
                method,
                url: href,
                headers: { 'Content-Type': contentType },
                data: method === 'POST' || method === 'PUT' ? data.trim() : null,
            });
        }
    }
}

module.exports = CameraAdapter;
