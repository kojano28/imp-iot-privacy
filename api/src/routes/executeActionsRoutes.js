const express = require('express');
const router = express.Router();
const executeActionsController = require('../controllers/executeActionsController');


router.post('/data', (req, res) => executeActionsController.handleFrontendPost(req, res));



module.exports = router;
