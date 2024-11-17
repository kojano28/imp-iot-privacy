require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const path = require('path');
const app = express();
const dataRoutes = require('./routes/DataRoutes');

// Middleware to parse JSON
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl} from ${req.ip}`);
    next();
});

// Serve the Thing Description via the standard WoT endpoint
app.get('/.well-known/wot-thing-description', (req, res) => {
    const tdPath = path.join(__dirname, 'data/TD/camera.json');
    res.sendFile(tdPath, err => {
        if (err) {
            console.error('Error serving Thing Description:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Use data routes for additional APIs
app.use('/api', dataRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DataService (WoT-compliant) is running on port ${PORT}`);
});
