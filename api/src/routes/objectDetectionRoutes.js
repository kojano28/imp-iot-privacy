const express = require('express');
const router = express.Router();
const detectionController = require('../controllers/detectionController');

// New endpoint for detected devices
router.post('/detectedDevices', detectionController.receiveDetectedDevices);

module.exports = router;
