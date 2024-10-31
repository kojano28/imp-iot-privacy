// Temporary storage for the data intended for the HoloLens
let dataForHololens = null;

// Function to store data for the HoloLens
exports.storeDataForHololens = (req, res) => {
    // Log the incoming data for storage
    console.log("Storing data for HoloLens:", req.body);

    // Store the incoming data in memory
    dataForHololens = req.body;

    // Log confirmation of data storage
    console.log("Data stored successfully for HoloLens:", dataForHololens);

    res.json({ status: 'Data stored for HoloLens' });

    // Initialize dataForHololens with example data for testing purposes (can be removed in production)
    dataForHololens = {
        "action": {
            "humanReadableAction": "MuteState",
            "actionId": "action-001",
            "actionType": "mitigation",
            "dpvMapping": {
                "dpv:Process": "ex:AnalyzeSpeech",
                "dpv:hasProcessing": "dpv:Use",
                "dpv:hasDataController": "ex:ACMM",
                "dpv:hasPersonalData": [
                    {
                        "dpv:PersonalDataCategory": "AudioData",
                    }
                ],
                "dpv:hasLegalBasis": {
                    "type": "dpv:Consent",
                }
            }
        }
    };
};

// Function for HoloLens to retrieve stored data via GET
exports.getDataForHololens = (req, res) => {
    // Log retrieval attempt by the HoloLens
    console.log("HoloLens is attempting to retrieve data...");

    if (dataForHololens) {
        // Log the data being sent to HoloLens
        console.log("Sending stored data to HoloLens:", dataForHololens);

        res.json(dataForHololens); // Send the stored data to the HoloLens
        dataForHololens = null;    // Clear the data after sending

        // Log confirmation that data has been cleared after sending
        console.log("Data for HoloLens has been cleared after sending.");
    } else {
        // Log the absence of data
        console.log("No data available for HoloLens retrieval.");

        res.status(204).send(); // No content available
    }
};
