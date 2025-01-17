const axios = require('axios'); // Import axios for making HTTP requests

// Function to receive and forward each IP address individually
exports.receiveDetectedDevices = async (req, res) => {
    const ipList = req.body; // Expecting a list of IP addresses in the request body

    // Validate that ipList is an array and not empty
    if (!Array.isArray(ipList) || ipList.length === 0) {
        return res.status(400).json({ error: 'Invalid IP data received' });
    }

    // Placeholder target URL for the matching service
    const matchingServiceUrl = 'http://matchingservice:8082/api/analyze-device';

    try {
        // Iterate over each IP address and send individually
        for (const ip of ipList) {
            const response = await axios.post(matchingServiceUrl,
                { DATASERVICE_URL: `http://${ip}` }, // Format IP as a URL in DATASERVICE_URL field
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Check if the request was successful
            if (response.status !== 200) {
                console.error(`Failed to send IP ${ip} to matching service`);
                return res.status(500).json({ error: `Failed to send IP ${ip} to matching service` });
            }
        }

        // If all IP addresses were sent successfully
        res.status(200).json({ message: 'All IP addresses forwarded successfully' });
    } catch (error) {
        console.error('Error forwarding IP addresses:', error);
        res.status(500).json({ error: 'An error occurred while forwarding IP addresses' });
    }
};
