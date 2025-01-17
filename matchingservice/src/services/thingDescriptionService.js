const axios = require('axios');

/**
 * Fetch the Thing Description (TD) from the given DataService URL.
 * @param {string} dataservice_url - Base URL of the DataService.
 * @returns {Object} - Thing Description JSON.
 */
exports.getThingDescription = async (dataservice_url) => {
    try {
        console.log(`Fetching Thing Description from: ${dataservice_url}/.well-known/wot-thing-description`);
        const response = await axios.get(`${dataservice_url}/.well-known/wot-thing-description`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Thing Description:', error.message);
        throw new Error(`Failed to fetch Thing Description: ${error.message}`);
    }
};

/**
 * Fetch the Privacy Policy from the given DataService URL.
 * @param {string} dataservice_url - Base URL of the DataService.
 * @returns {Object} - Privacy Policy JSON.
 */
exports.getPrivacyPolicy = async (dataservice_url) => {
    try {
        console.log(`Fetching Privacy Policy from: ${dataservice_url}/api/privacypolicy`);
        const response = await axios.get(`${dataservice_url}/api/privacypolicy`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Privacy Policy:', error.message);
        throw new Error(`Failed to fetch Privacy Policy: ${error.message}`);
    }
};
