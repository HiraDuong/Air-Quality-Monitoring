const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mqttService = require('./src/services/mqttWsService');

const deviceDataRouter = require('./src/routes/DeviceDataRoute');
dotenv.config();

// Kết nối tới cơ sở dữ liệu MongoDB
const connectDB = require('./src/configs/mongoDB');
connectDB(); // Gọi hàm connectDB

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Sử dụng router deviceDataRouter tại '/api'
app.use('/api', deviceDataRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Kết nối MQTT và xử lý dữ liệu
mqttService(); // Gọi hàm connectMQTT từ mqttService.js
