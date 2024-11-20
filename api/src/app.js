const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const getActionsRoutes = require('./routes/getActionsRoutes');
const executeActionsRoutes = require('./routes/executeActionsRoutes');
const checkActionsStatusRoutes = require('./routes/executeActionsRoutes');
const objectDetectionRoutes = require('./routes/objectDetectionRoutes');


// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());


// Define routes
// 4 Incoming routes
// - objectDetection (dataservice_url triggers matchingservice with POST http://localhost:8082/api/analyze-device "dataservice_url") - loop Holo
// - getActions (get all actions from api service) - loop Holo
// - executeActions (action_id, dataservice_url, with interaction iot device POST...) - Userbased Holo
//      - getPrivacyAction (sends json action ID and gets request for IOT device from AI Service)
// - checkActionStatus (GET from hololens to api service to check action status) - loop Holo


app.use('/api/getActions', getActionsRoutes);
app.use('/api/executeActions', executeActionsRoutes);
app.use('/api/objectDetection', objectDetectionRoutes);
app.use('/api/checkActionsStatus', checkActionsStatusRoutes);


// Start the server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
