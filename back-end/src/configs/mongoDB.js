const mongoose = require('mongoose');

// URI kết nối tới MongoDB Atlas
const uri = "mongodb+srv://hirakuminamoto:Duongduong123@iot-sensor.uzmihwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Các tham số kết nối
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
};

// Kết nối tới cơ sở dữ liệu MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(uri, connectionParams);
        console.log('Connected to database');
    } catch (err) {
        console.error(`Error connecting to the database. \n${err}`);
    }
};

module.exports = connectDB;
