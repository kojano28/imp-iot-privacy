const express = require('express');
const router = express.Router();
const executeActionsController = require('../controllers/executeActionsController');



// Correctly wrap the async function to prevent it from being treated as a Promise
router.post('/data', (req, res) => executeActionsController.handleFrontendPost(req, res));



module.exports = router;
