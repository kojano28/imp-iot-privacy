const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');

// Route to get the privacy policy (not WoT standard but additional functionality)
router.get('/privacypolicy', DataController.getPrivacyPolicy);

// Optional: Add more routes here if necessary

module.exports = router;
