// src/app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crawlerRoutes = require('./routes/crawlerRoutes');
const { storePrivacyPolicies } = require('./controllers/crawlerController');  // Import the store function

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('MongoDB connected');

        // Call the storePrivacyPolicies function after MongoDB connection is established
        await storePrivacyPolicies();

        console.log('Privacy policies stored on startup');
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/crawler', crawlerRoutes);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
