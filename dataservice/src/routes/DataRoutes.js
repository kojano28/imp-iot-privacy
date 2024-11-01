// DataRoutes.js
const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');

// Route to get the privacy policy
router.get('/privacypolicy', DataController.getPrivacyPolicy);

// Route to get the Thing Description
router.get('/thingdescription', DataController.getThingDescription);

module.exports = router;
