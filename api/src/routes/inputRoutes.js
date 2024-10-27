const express = require('express');
const router = express.Router();
const inputController = require('../controllers/inputController');

router.post('/data', inputController.receiveData);

module.exports = router;
