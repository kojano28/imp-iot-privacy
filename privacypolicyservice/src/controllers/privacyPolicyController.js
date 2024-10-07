// src/controllers/privacyPolicyController.js

const PrivacyPolicy = require('../models/privacyPolicyModel');

// Get Privacy Policy by Device Name
exports.getPrivacyPolicyByDeviceName = async (req, res) => {
    const { deviceName } = req.query;

    try {
        const policy = await PrivacyPolicy.findOne({ deviceName: deviceName });
        if (!policy) {
            return res.status(404).json({ message: 'Privacy policy not found for device: ' + deviceName });
        }
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};
