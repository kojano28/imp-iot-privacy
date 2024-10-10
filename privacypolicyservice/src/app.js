const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const privacyPolicyRoutes = require('./routes/privacyPolicyRoutes');
const dpvOntologyService = require('./services/dpvOntologyService');

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Load the DPV ontology once at the start of the application
dpvOntologyService.loadDPVOntology().catch(err => {
    console.error('Error loading DPV ontology during startup:', err);
    process.exit(1);  // Exit the application if DPV loading fails
});

// Define routes
app.use('/api', privacyPolicyRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
