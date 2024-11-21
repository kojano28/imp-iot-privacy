// matchingRoutes.js
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const deviceProcessor = require('../services/deviceProcessor');

// Route to initiate the analysis process with DATASERVICE_URL direct call
    // router.post('/analyze-device', deviceController.analyzeDevice);


// Route to initiate the get the processed json from the cache  process with DATASERVICE_URL
router.post('/analyze-device', deviceProcessor.getTDactions);

module.exports = router;