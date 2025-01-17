const path = require('path');

// Controller for handling the privacy policy request
exports.getPrivacyPolicyCamera = (req, res) => {
    const privacyPolicyPath = path.join(__dirname, '../data/privacypolicies/01_camera.ttl');
    res.sendFile(privacyPolicyPath, err => {
        if (err) {
            console.error('Error serving Camera Privacy Policy:', err);
            res.status(500).send('Internal Server Error');
        }
    });
};

exports.getPrivacyPolicyHueLamp = (req, res) => {
    const privacyPolicyPath = path.join(__dirname, '../data/privacypolicies/02_huelamp.ttl');
    res.sendFile(privacyPolicyPath, err => {
        if (err) {
            console.error('Error serving Hue Lamp Privacy Policy:', err);
            res.status(500).send('Internal Server Error');
        }
    });
};
