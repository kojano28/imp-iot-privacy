const express = require('express');
const path = require('path');

const app = express();

// Middleware for Hue Lamp Service
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Hue Lamp Service: ${req.method} request to ${req.originalUrl}`);
    next();
});

// Serve Hue Lamp Thing Description
app.get('/.well-known/wot-thing-description', (req, res) => {
    const tdPath = path.join(__dirname, '../data/TD/huelamp.json');
    res.sendFile(tdPath, err => {
        if (err) {
            console.error('Error serving Hue Lamp Thing Description:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Serve Hue Lamp Privacy Policy
app.get('/privacy', (req, res) => {
    const privacyPolicyPath = path.join(__dirname, '../data/privacypolicies/02_huelamp.ttl');
    res.sendFile(privacyPolicyPath, err => {
        if (err) {
            console.error('Error serving Hue Lamp Privacy Policy:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = app;
