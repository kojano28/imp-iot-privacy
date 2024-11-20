const express = require('express');
const router = express.Router();
const getActionsController = require('../controllers/getActionsController');

// POST route to store data for the HoloLens
router.post('/sendToHololens', getActionsController.storeDataForHololens);

// GET route for HoloLens to fetch the stored data
router.get('/fetchDataForHololens', getActionsController.getDataForHololens);

// GET route for HoloLens to poll for completed actions.
//router.get('/completedActions', outputController.completeActions);

module.exports = router;
