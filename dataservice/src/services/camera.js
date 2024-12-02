const express = require('express');
const path = require('path');

const app = express();

// Middleware for Camera Service
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Camera Service: ${req.method} request to ${req.originalUrl}`);
    next();
});

// Serve Camera Thing Description
app.get('/.well-known/wot-thing-description', (req, res) => {
    const tdPath = path.join(__dirname, '../data/TD/camera.json');
    res.sendFile(tdPath, err => {
        if (err) {
            console.error('Error serving Camera Thing Description:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Serve Camera Privacy Policy
app.get('/api/privacypolicy', (req, res) => {
    const privacyPolicyPath = path.join(__dirname, '../data/privacypolicies/01_camera.ttl');
    res.sendFile(privacyPolicyPath, err => {
        if (err) {
            console.error('Error serving Camera Privacy Policy:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = app;
