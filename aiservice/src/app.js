// app.js
const express = require('express');
const dotenv = require('dotenv');
const aiRoutes = require('./routes/aiRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api', aiRoutes);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`AI Service is running on port ${PORT}`);
});
