const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// Route to get privacy policy by device name and analyze it
router.get('/td', deviceController.getDeviceThingDescription);

module.exports = router;
