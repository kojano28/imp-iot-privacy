const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

router.post('/control', iotController.controlDevice);

module.exports = router;
