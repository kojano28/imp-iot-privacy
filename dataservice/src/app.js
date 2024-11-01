// app.js
require('dotenv').config();  // Load environment variables from .env
const express = require('express');
const app = express();
const dataRoutes = require('./routes/DataRoutes');
const path = require('path');

// Middleware to parse JSON
app.use(express.json());

// Use data routes
app.use('/api', dataRoutes);

// Serve the Thing Description via hypermedia interface
app.get('/', (req, res) => {
    const tdPath = path.join(__dirname, 'data/TD/camera.json');
    res.sendFile(tdPath);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DataService is running on port ${PORT}`);
});
