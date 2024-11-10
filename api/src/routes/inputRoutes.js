const express = require('express');
const router = express.Router();
const inputController = require('../controllers/inputController');
const detectionController = require('../controllers/detectionController');


// Correctly wrap the async function to prevent it from being treated as a Promise
router.post('/data', (req, res) => inputController.handleFrontendPost(req, res));

// New endpoint for detected devices
router.post('/detectedDevices', detectionController.receiveDetectedDevices);

module.exports = router;
