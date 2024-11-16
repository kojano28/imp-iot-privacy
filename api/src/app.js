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
// 4 Incoming routes
// - objectDetection (dataservice_url triggers matchingservice with POST http://localhost:8082/api/analyze-device "dataservice_url")
// - getActions (get all actions from api service)
// - executeActions (action_id, dataservice_url, with interaction iot device POST...)
//      - getPrivacyAction (sends json action ID and gets request for IOT device from AI Service)
// - checkActionStatus (GET from hololens to api service to check action status)


app.use('/api/output', outputRoutes);
app.use('/api/input', inputRoutes);
//app.use('/api/iot', iotRoutes);

// Start the server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
