// src/routes/DataRoutes.js
const express = require('express');
const router = express.Router();
const privacyPolicyController = require('../controllers/privacyPolicyController');

// Route to get privacy policy by device name and analyze it
router.get('/privacy-policy', privacyPolicyController.getPrivacyPolicyByDeviceName);

module.exports = router;
