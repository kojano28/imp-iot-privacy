const axios = require('axios');
const crypto = require('crypto');

async function makeDigestRequest({ url, method = 'GET', username, password, data = null }) {
    try {
        // First request to get the WWW-Authenticate header
        const initialResponse = await axios({ url, method, validateStatus: false });

        if (initialResponse.status !== 401 || !initialResponse.headers['www-authenticate']) {
            throw new Error('Failed to retrieve Digest Authentication challenge.');
        }

        // Parse the WWW-Authenticate header
        const authHeader = initialResponse.headers['www-authenticate'];
        const authParams = parseAuthHeader(authHeader);

        // Compute Digest Authentication header
        const digestHeader = computeDigestHeader({
            username,
            password,
            method,
            uri: url,
            authParams,
        });

        // Send the authenticated request
        const response = await axios({
            url,
            method,
            headers: { Authorization: digestHeader, 'Content-Type': 'application/xml' },
            data,
        });

        return response.data;
    } catch (error) {
        console.error('Error during Digest Authentication:', error.message || error);
        throw error;
    }
}

function parseAuthHeader(authHeader) {
    const parts = authHeader.split(',').reduce((acc, part) => {
        const [key, value] = part.trim().split('=');
        acc[key] = value.replace(/"/g, '');
        return acc;
    }, {});
    return parts;
}

function computeDigestHeader({ username, password, method, uri, authParams }) {
    const ha1 = crypto.createHash('md5').update(`${username}:${authParams.realm}:${password}`).digest('hex');
    const ha2 = crypto.createHash('md5').update(`${method}:${uri}`).digest('hex');
    const response = crypto.createHash('md5').update(`${ha1}:${authParams.nonce}:${ha2}`).digest('hex');

    return `Digest username="${username}", realm="${authParams.realm}", nonce="${authParams.nonce}", uri="${uri}", response="${response}", algorithm="MD5"`;
}

module.exports = { makeDigestRequest };
