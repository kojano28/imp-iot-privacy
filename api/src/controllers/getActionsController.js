// Primary storage for the data intended for later processes and HoloLens
let mainDataStorage = {};
// Temporary storage specifically for HoloLens retrieval
let dataForHololens = null;

// Function to store data for the HoloLens
exports.storeDataForHololens = (req, res) => {
    // Log the incoming data for storage with full detail
    console.log("Storing data in main storage:", JSON.stringify(req.body, null, 2));

    // Store the incoming data in the main storage
    mainDataStorage = req.body;
    // Create a temporary copy for HoloLens retrieval
    dataForHololens = { ...req.body };

    console.log("Data stored successfully. Temporary copy made for HoloLens.");

    res.json({ status: 'Data stored and temporary copy created for HoloLens' });
};

// Expose a getter function for mainDataStorage
exports.getMainDataStorage = () => {
    return mainDataStorage;
};

// Function for HoloLens to retrieve stored data via GET
exports.getDataForHololens = (req, res) => {
    // Log retrieval attempt by the HoloLens
    console.log("HoloLens is attempting to retrieve data...");

    if (dataForHololens) {
        // Log the data being sent to HoloLens
        console.log("Sending temporary data to HoloLens:", JSON.stringify(dataForHololens, null, 2));

        res.json(dataForHololens); // Send the temporary data to the HoloLens
        dataForHololens = null;    // Clear the temporary data after sending

        console.log("Temporary data for HoloLens has been cleared after sending.");
    } else {

        console.log("No temporary data available for HoloLens retrieval.");

        res.status(204).send();
    }
};
