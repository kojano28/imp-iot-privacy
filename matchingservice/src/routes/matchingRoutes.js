// matchingRoutes.js
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// Route to initiate the analysis process with DATASERVICE_URL
router.post('/analyze-device', deviceController.analyzeDevice);

module.exports = router;