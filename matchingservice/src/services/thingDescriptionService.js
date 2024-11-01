// thingDescriptionService.js
const axios = require('axios');

exports.getThingDescription = async (DATASERVICE_URL) => {
    const response = await axios.get(`${DATASERVICE_URL}/`);
    return response.data;
};

exports.getPrivacyPolicy = async (DATASERVICE_URL) => {
    const response = await axios.get(`${DATASERVICE_URL}/api/privacypolicy`);
    return response.data;
};
