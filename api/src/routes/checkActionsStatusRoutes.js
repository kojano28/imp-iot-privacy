const express = require('express');
const router = express.Router();
const checkActionsStatusController = require('../controllers/checkActionsStatusController');

// Route for retrieving completed actions
router.get('/completedActions', (req, res) =>
    checkActionsStatusController.getCompletedActions(req, res)
);

module.exports = router;
