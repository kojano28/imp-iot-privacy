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

        // Log the complete configuration for debugging
        console.log(`Preparing to send request:`);
        console.log(`- URL: ${href}`);
        console.log(`- Method: ${method}`);
        console.log(`- Content-Type: ${contentType}`);
        console.log(`- Data: ${data ? JSON.stringify(data) : 'None'}`);
        console.log(`- Requires Digest Authentication: ${requiresDigest}`);

        if (requiresDigest) {
            // Use Digest Authentication
            const username = process.env.CAMERA_USERNAME; // From .env
            const password = process.env.CAMERA_PASSWORD; // From .env

            console.log(`- Authentication: Digest`);
            console.log(`- Username: ${username}`);
            console.log(`- Password: [REDACTED]`); // Don't log sensitive details in production

            const digestRequestConfig = {
                url: href,
                method,
                username,
                password,
                headers: { 'Content-Type': contentType },
                data: data?.trim(),
            };

            console.log(`Digest Request Configuration:`, digestRequestConfig);

            return await makeDigestRequest(digestRequestConfig);
        } else {
            // Standard request
            console.log(`- Authentication: None`);
            const axiosRequestConfig = {
                method,
                url: href,
                headers: { 'Content-Type': contentType },
                data: method === 'POST' || method === 'PUT' ? data?.trim() : null,
            };

            console.log(`Axios Request Configuration:`, axiosRequestConfig);

            return await axios(axiosRequestConfig);
        }
    }

}

module.exports = CameraAdapter;
