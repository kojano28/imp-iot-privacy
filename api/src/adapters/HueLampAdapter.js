require('dotenv').config(); // Ensure environment variables are loaded
const axios = require('axios');

class HueLampAdapter {
    constructor() {
        this.apiKey = process.env.HUE_API_KEY;
        this.ip = process.env.HUE_IP;

        if (!this.apiKey || !this.ip) {
            throw new Error('HueLampAdapter: Missing HUE_API_KEY or HUE_IP in environment variables');
        }
    }

    async sendActionHue({ href, contentType }) {
        const url = href.replace('IP', this.ip).replace('APIKEY', this.apiKey);

        // Log the request details
        console.log('Sending action with the following details:');
        console.log('URL:', url);
        console.log('Headers:', { 'Content-Type': contentType });
        console.log('Data:', JSON.stringify({ on: false }));

        return await axios({
            method: 'PUT',
            url,
            headers: { 'Content-Type': contentType },
            data: JSON.stringify({ on: false }), // Example: Turn off lamp
        });
    }
}

module.exports = HueLampAdapter;
