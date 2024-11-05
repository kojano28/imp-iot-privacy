const express = require('express');
const router = express.Router();
const inputController = require('../controllers/inputController');
const detectionController = require('../controllers/detectionController');
// Existing endpoint
router.post('/data', inputController.receiveData);

// New endpoint for detected devices
router.post('/detectedDevices', detectionController.receiveDetectedDevices);

module.exports = router;
