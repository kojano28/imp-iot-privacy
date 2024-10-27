const fetch = require('node-fetch');

// Function to send data to the frontend
exports.postToHololens = async (req, res) => {
    //This means the whole JSON structure is in the body
    const dataToSend = req.body;

    try {
        //Here comes the endpoint of the Hololens UI for sending the JSONs
        const response = await fetch('http://localhost:3010/api/receiveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            throw new Error(`Failed to post to hololens: ${response.statusText}`);
        }

        // Optionally handle response from the Hololens UI
        const frontendResponse = await response.json();
        res.json({ status: 'Data sent to Hololens', frontendResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
