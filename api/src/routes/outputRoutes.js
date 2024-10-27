const express = require('express');
const router = express.Router();
const outputController = require('../controllers/outputController');

// Route to post data to frontend
router.post('/sendToHololens', outputController.postToHololens);

module.exports = router;
