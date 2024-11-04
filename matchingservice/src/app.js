const express = require('express');
const dotenv = require('dotenv');
const matchingRoutes = require('./routes/matchingRoutes');


// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());


// Define routes
app.use('/api', matchingRoutes);

// Start the server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});