// src/models/privacyPolicyModel.js

const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema({
    deviceName: { type: String, required: true },
    policyContent: { type: String, required: true },  // Change to policyContent
    policyURL: { type: String },                      // Optional field for URLs
    createdAt: { type: Date, default: Date.now }      // Timestamp when the policy was stored
});

module.exports = mongoose.model('PrivacyPolicy', privacyPolicySchema);
