// src/models/privacyPolicyModel.js

const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema({
    deviceName: { type: String, required: true },
    policy: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrivacyPolicy', privacyPolicySchema);
