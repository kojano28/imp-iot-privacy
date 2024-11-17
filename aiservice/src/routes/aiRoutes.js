const express = require('express');
const { generateCurlCommand } = require('../controllers/aiController'); // Ensure this path is correct

const router = express.Router();

// Define your POST route
router.post('/generate-curl', async (req, res) => {
    try {
        const action = req.body; // Assuming the action is sent in the request body
        const curlCommand = await generateCurlCommand(action);
        res.json({ curlCommand });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
