exports.receiveData = (req, res) => {
    //we receive from the hololens the actionId and some parameters (on/off, music volume etc.)
    const { actionId, ...optionalParams } = req.body.data || {};

    if (!actionId) {
        return res.status(400).json({ error: "Missing 'actionId' in request body" });
    }

    // Process actionId and optional parameters
    res.json({
        message: "Data received from frontend",
        actionId,
        optionalParams: optionalParams || {},
    });
};
