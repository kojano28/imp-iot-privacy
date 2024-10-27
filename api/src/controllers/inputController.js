exports.receiveData = (req, res) => {
    const { data } = req.body;
    // Process input data from frontend
    res.json({ message: "Data received from frontend", data });
};
