// Temporary storage for the data intended for the HoloLens
let dataForHololens = null;

// Function to store data for the HoloLens
exports.storeDataForHololens = (req, res) => {
    //dataForHololens = req.body; // Store the incoming data in memory
    //res.json({ status: 'Data stored for HoloLens' });
    dataForHololens = {
        message: "Test data for HoloLens",
        timestamp: new Date().toISOString(),
        payload: {
            actionId: 2,
            values: [10, 20, 30]
        }
    }
};

// Function for HoloLens to retrieve stored data via GET
exports.getDataForHololens = (req, res) => {
    if (dataForHololens) {
        res.json(dataForHololens); // Send the stored data to the HoloLens
        dataForHololens = null;    // Clear the data after sending
    } else {
        res.status(204).send(); // No content available
    }
};
