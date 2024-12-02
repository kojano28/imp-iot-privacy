require('dotenv').config(); // Load environment variables
const cameraApp = require('./services/camera');
const hueLampApp = require('./services/huelamp');

// Start Camera Service
const CAMERA_PORT = process.env.CAMERA_PORT || 3000;
cameraApp.listen(CAMERA_PORT, () => {
    console.log(`Camera Service is running on port ${CAMERA_PORT}`);
});

// Start Hue Lamp Service
const HUELAMP_PORT = process.env.HUELAMP_PORT || 4000;
hueLampApp.listen(HUELAMP_PORT, () => {
    console.log(`Hue Lamp Service is running on port ${HUELAMP_PORT}`);
});
