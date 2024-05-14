const DeviceDataModel = require('../models/DeviceDataModel');

// Lấy tất cả dữ liệu từ MongoDB
const getAllData = async (req, res) => {
    try {
        const data = await DeviceDataModel.find();
        res.json(data);
    } catch (error) {
        res.json({ message: error });
    }
};

// Lấy dữ liệu từ MongoDB theo ID
const getDataById = async (req, res) => {
    try {
        const data = await DeviceDataModel.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.json({ message: error });
    }
};