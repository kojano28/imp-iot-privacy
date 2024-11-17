const path = require('path');

// Controller for handling the privacy policy request
exports.getPrivacyPolicy = (req, res) => {
    const privacyPolicyPath = path.join(__dirname, '../data/privacypolicies/01_camera.ttl');
    res.sendFile(privacyPolicyPath, err => {
        if (err) {
            console.error('Error serving Privacy Policy:', err);
            res.status(500).send('Internal Server Error');
        }
    });
};

// Optional: Add more handlers if needed
