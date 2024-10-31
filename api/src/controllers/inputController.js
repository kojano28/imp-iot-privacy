exports.receiveData = (req, res) => {
    // Log the incoming request body for debugging
    console.log("Received request body:", req.body);

    // Extract actionId and optional parameters directly from req.body
    const { actionId, ...optionalParams } = req.body || {};

    // Check if actionId is present and log an error if it’s missing
    if (!actionId) {
        console.error("Error: Missing 'actionId' in request body");
        return res.status(400).json({ error: "Missing 'actionId' in request body" });
    }

    // Log actionId and optional parameters for confirmation
    console.log("Action ID:", actionId);
    console.log("Optional Parameters:", optionalParams || {});

    // Process actionId and optional parameters and respond
    res.json({
        message: "Data received from frontend",
        actionId,
        optionalParams: optionalParams || {},
    });
};
