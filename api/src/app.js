const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const outputRoutes = require('./routes/outputRoutes');
const inputRoutes = require('./routes/inputRoutes');
const iotRoutes = require('./routes/iotRoutes');


// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());


// Define routes
app.use('/api/output', outputRoutes);
app.use('/api/input', inputRoutes);
app.use('/api/iot', iotRoutes);

// Start the server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
