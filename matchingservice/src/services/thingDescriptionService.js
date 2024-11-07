// thingDescriptionService.js
const axios = require('axios');

exports.getThingDescription = async (dataservice_url) => {
    const response = await axios.get(`${dataservice_url}/`);
    return response.data;
};

exports.getPrivacyPolicy = async (dataservice_url) => {
    const response = await axios.get(`${dataservice_url}/api/privacypolicy`);
    return response.data;
};