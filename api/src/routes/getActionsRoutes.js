const express = require('express');
const router = express.Router();
const getActionsController = require('../controllers/getActionsController');

// POST route to store data for the HoloLens
router.post('/sendToHololens', getActionsController.storeDataForHololens);

// GET route for HoloLens to fetch the stored data
router.get('/fetchDataForHololens', getActionsController.getDataForHololens);

module.exports = router;
