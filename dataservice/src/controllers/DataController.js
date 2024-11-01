// DataController.js
const path = require('path');

exports.getPrivacyPolicy = (req, res) => {
    const policyPath = path.join(__dirname, '../data/privacypolicies/01_camera.ttl');
    res.sendFile(policyPath);
};

exports.getThingDescription = (req, res) => {
    const tdPath = path.join(__dirname, '../data/TD/camera.json');
    res.sendFile(tdPath);
};
