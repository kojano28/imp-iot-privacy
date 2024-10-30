const express = require('express');
const router = express.Router();
const outputController = require('../controllers/outputController');

// POST route to store data for the HoloLens
router.post('/sendToHololens', outputController.storeDataForHololens);

// GET route for HoloLens to fetch the stored data
router.get('/fetchDataForHololens', outputController.getDataForHololens);

module.exports = router;
