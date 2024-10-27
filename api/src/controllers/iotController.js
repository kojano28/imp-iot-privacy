exports.controlDevice = (req, res) => {
    const { deviceId, action } = req.body;
    // Logic to interact with the IoT device
    res.json({ message: `Action ${action} sent to device ${deviceId}` });
};
