const mqtt = require('mqtt');
const DeviceDataModel = require('../models/DeviceDataModel');

function calculateAQI_CO(ppm) {
    // Bảng chuyển đổi AQI cho khí CO
    const breakpoints = [
        { c_low: 0.0, c_high: 4.4, i_low: 0, i_high: 50 },
        { c_low: 4.5, c_high: 9.4, i_low: 51, i_high: 100 },
        { c_low: 9.5, c_high: 12.4, i_low: 101, i_high: 150 },
        { c_low: 12.5, c_high: 15.4, i_low: 151, i_high: 200 },
        { c_low: 15.5, c_high: 30.4, i_low: 201, i_high: 300 },
        { c_low: 30.5, c_high: 40.4, i_low: 301, i_high: 400 },
        { c_low: 40.5, c_high: 50.4, i_low: 401, i_high: 500 }
    ];

    // Tìm khoảng AQI phù hợp dựa trên giá trị ppm
    let aqi = null; // Khởi tạo aqi bằng null nếu ppm không nằm trong bất kỳ khoảng nào

    for (let i = 0; i < breakpoints.length; i++) {
        if (ppm >= breakpoints[i].c_low && ppm <= breakpoints[i].c_high) {
            // Tính toán AQI
            aqi = ((breakpoints[i].i_high - breakpoints[i].i_low) / (breakpoints[i].c_high - breakpoints[i].c_low)) * (ppm - breakpoints[i].c_low) + breakpoints[i].i_low;
            break;
        }
    }

    // Nếu ppm vượt quá giá trị cao nhất trong bảng, gán aqi bằng 500
    if (ppm > breakpoints[breakpoints.length - 1].c_high) {
        aqi = 500;
    }

    return Math.round(aqi);
}

// Ví dụ sử dụng:
let ppmCO = 10; // Nồng độ CO tính bằng ppm
let aqiCO = calculateAQI_CO(ppmCO);
console.log(`AQI for CO concentration of ${ppmCO} ppm is ${aqiCO}`);

// Kiểm tra với nồng độ CO vượt quá giới hạn
ppmCO = 55; // Nồng độ CO vượt quá giới hạn
aqiCO = calculateAQI_CO(ppmCO);
console.log(`AQI for CO concentration of ${ppmCO} ppm is ${aqiCO}`);


// Ví dụ tính AQI cho ppm = 6
const ppm_CO = 6;
const aqi_CO = calculateAQI_CO(ppm_CO);
console.log(`AQI cho CO (${ppm_CO} ppm): ${aqi_CO}`);


const connectMQTT = () => {
    const client = mqtt.connect('mqtt://broker.emqx.io');
    const wsClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
        client.subscribe('1147707_nhom5', (err) => {
            if (!err) {
                console.log('Connected to MQTT broker');
            }
        });
    });

    wsClient.on('connect', () => {
        console.log('Connected to MQTT over WebSocket');
    });

    client.on('message', async (topic, message) => {
        console.log('Received message from MQTT broker');
        const data = JSON.parse(message.toString());
        console.log(data);

        // Tính toán giá trị AQI
        const aqi = calculateAQI_CO(data.ppm);

        // Lưu dữ liệu vào MongoDB
        const newData = {
            weather: data.weather,
            temp: data.temp,
            humid: data.humid,
            aqi: aqi,
            ppm:data.ppm<=500? data.ppm:500,
            time: new Date()
        };

        try {
            // Tìm và cập nhật dữ liệu cho deviceId tương ứng, nếu không tìm thấy thì tạo mới
            const updatedData = await DeviceDataModel.findOneAndUpdate(
                { deviceId: data.deviceId },
                { $push: { data: newData } },
                { upsert: true, new: true }
            );

            console.log('Data saved to MongoDB');
        } catch (err) {
            console.error(err);
            return;
        }

        // Xuất bản dữ liệu đến MQTT WebSocket broker
        const responseMessage = JSON.stringify({
            message: "Get data from MQTT broker"
        });
        wsClient.publish('iot-1147707_nhom5/ws', responseMessage);
    });
};

module.exports = connectMQTT;
