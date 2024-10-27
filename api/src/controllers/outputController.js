const fetch = require('node-fetch');

// Function to send data to the frontend
exports.postToHololens = async (req, res) => {
    const dataToSend = { message: "Data from backend to hololens" };

    try {
        const response = await fetch('https://c84a69d1-4eeb-42db-8c79-c4ad919feb38.mock.pstmn.io/api/receiveData', {
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
