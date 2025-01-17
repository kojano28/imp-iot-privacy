const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const getActionsRoutes = require('./routes/getActionsRoutes');
const executeActionsRoutes = require('./routes/executeActionsRoutes');
const checkActionsStatusRoutes = require('./routes/checkActionsStatusRoutes');
const objectDetectionRoutes = require('./routes/objectDetectionRoutes');


// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());


app.use('/api/getActions', getActionsRoutes);
app.use('/api/executeActions', executeActionsRoutes);
app.use('/api/objectDetection', objectDetectionRoutes);
app.use('/api/checkActionsStatus', checkActionsStatusRoutes);


// Start the server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
