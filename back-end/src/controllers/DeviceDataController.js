const e = require('express');
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


// Lấy tất cả dữ liệu từ MongoDB
const getAllData = async (req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const data = await DeviceDataModel.find();
        res.json(data);
    } catch (error) {
        res.json({ message: error });
    }
};


// find by deviceID
const getDataById = async (req, res) => {
    // const token = req.header('auth-token');
    // if (!token) return res.status(401).send('Access Denied');
    try {
        const data = await DeviceDataModel.find({ deviceId: req.params.id });;
        res.json(data);
    } catch (error) {
        res.json({ message: error });
    }
};

const addData = async (req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    const newData = {
        weather: req.body.weather,
        temp: req.body.temp,
        humid: req.body.humid,
        aqi: calculateAQI_CO(req.body.ppm),
        ppm: req.body.ppm,
        time: req.body.time
    };

    try {
        // Tìm và cập nhật dữ liệu cho deviceId tương ứng, nếu không tìm thấy thì tạo mới
        const updatedData = await DeviceDataModel.findOneAndUpdate(
            { deviceId: req.body.deviceId },
            { $push: { data: newData } },
            { upsert: true, new: true }
        );

        res.json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get all Deivces data with the newest data

const getAllDevicesNewestData = async (req, res) => {
    try {
        const devicesData = await DeviceDataModel.aggregate([
            { $sort: { deviceId: 1, 'data.time': -1 } }, // Sắp xếp theo deviceId và thời gian giảm dần
            {
                $group: {
                    _id: '$deviceId',
                    latestData: { $first: '$data' },
                    location: { $first: '$location' }
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceId: '$_id',
                    location: '$location',
                    latestData: { $arrayElemAt: ['$latestData', -1] }
                }
            },
            {
                $project: {
                    deviceId: 1,
                    location: 1,
                    weather: '$latestData.weather',
                    temp: '$latestData.temp',
                    humid: '$latestData.humid',
                    aqi: '$latestData.aqi',
                    ppm: '$latestData.ppm',
                    time: '$latestData.time'
                }
            }
        ]);
        devicesData.sort((a, b) => a.deviceId - b.deviceId);
        res.json(devicesData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDeviceNewestData = async (req, res) => {
    try {
        const deviceId = parseInt(req.params.id);

        const deviceData = await DeviceDataModel.aggregate([
            { $match: { deviceId: deviceId } },
            { $sort: { 'data.time': -1 } },
            {
                $group: {
                    _id: '$deviceId',
                    latestData: { $first: '$data' },
                    location: { $first: '$location' }
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceId: '$_id',
                    location: '$location',
                    latestData: { $arrayElemAt: ['$latestData', -1] }
                }
            },
            {
                $project: {
                    deviceId: 1,
                    location: 1,
                    weather: '$latestData.weather',
                    temp: '$latestData.temp',
                    humid: '$latestData.humid',
                    aqi: '$latestData.aqi',
                    ppm: '$latestData.ppm',
                    time: '$latestData.time'
                }
            }
        ]);

        if (deviceData.length === 0) {
            return res.status(404).json({ message: 'No data found for the given deviceId.' });
        }

        res.json(deviceData[0]); // Return the first (and only) result
    } catch (error) {
        console.error('Error in getDeviceNewestData:', error);
        res.status(500).json({ message: error.message });
    }
}

// Thêm nhiều dữ liệu
const addManyData = async (req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        for (const element of req.body.data) {
            const aqi = calculateAQI_CO(element.ppm); // Tính toán AQI từ ppm
            const newData = {
                weather: element.weather,
                temp: element.temp,
                humid: element.humid,
                ppm: element.ppm,
                time: element.time,
                aqi: aqi
            };

            await DeviceDataModel.findOneAndUpdate(
                { deviceId: req.body.deviceId, location: req.body.location },
             
                { $push: { data: newData } },
                { upsert: true, new: true }
            );
        }
        res.status(200).send('Data added successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get historic 24 hour data by deviceId 
const historicHourly = async (req, res) => {
    // const token = req.header('auth-token');
    // if (!token) return res.status(401).send('Access Denied');

    const deviceId = parseInt(req.params.id);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 giờ trước
   
    try {
        const data = await DeviceDataModel.aggregate([
            {
                $match: { deviceId: deviceId, 'data.time': { $gte: oneDayAgo, $lte: now } }
            },
            {
                $unwind: '$data'
            },
            {
                $match: { 'data.time': { $gte: oneDayAgo, $lte: now } }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$data.time' },
                        month: { $month: '$data.time' },
                        day: { $dayOfMonth: '$data.time' },
                        hour: { $hour: '$data.time' }
                    },
                    avgTemp: { $avg: '$data.temp' },
                    avgHumid: { $avg: '$data.humid' },
                    avgAqi: {$avg: '$data.aqi'},
                    avgPpm: { $avg: '$data.ppm' },
                    time: { $first: '$data.time' } // Lấy thời gian đầu tiên trong nhóm
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.day': 1,
                    '_id.hour': 1
                }
            },
            {
                $addFields: {
                    timeAgo: {
                        $divide: [
                            { $subtract: [now, '$time'] }, // Tính toán khoảng thời gian từ now đến time
                            3600000 // Chia cho 3600000 để đổi sang giờ
                        ]
                    }
                }
            },
            {
                $addFields: {
                    time: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day',
                            hour: '$_id.hour'
                        }
                    }
                }
            },
            {
                $addFields: {
                    time: {
                        $dateToString: {
                            format: '%Y-%m-%dT%H:00:00.000Z',
                            date: '$time'
                        }
                    },
                    timeAgo: { $round: ['$timeAgo', 0] } // Làm tròn timeAgo xuống tới giờ gần nhất
                }
            },
            {
                $project: {
                    _id: 0,
                    weather: 1,
                    temp: { $round: ['$avgTemp'] },
                    humid: { $round: ['$avgHumid'] },
                    ppm: { $round: ['$avgPpm'] },
                    aqi: {$round :['$avgAqi']},
                    time: 1,
                    timeAgo: 1
                }
            }
        ]);
        
        const responseData = {
            deviceId: parseInt(deviceId),
            location: '', // Sẽ được cập nhật sau
            data: data
        };
        
        try {
            // Truy vấn để lấy thông tin location
            const deviceInfo = await DeviceDataModel.findOne({ deviceId: deviceId });
            if (deviceInfo) {
                responseData.location = deviceInfo.location;
            } else {
                responseData.location = 'Unknown'; // Hoặc giá trị mặc định nếu không tìm thấy thông tin
            }
        } catch (error) {
            console.error('Error fetching device info:', error);
            responseData.location = 'Error fetching location';
        }
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteByDeviceId = async ()=>{
    
}


module.exports = { historicHourly };
module.exports = { getAllData, getDataById,addData, getAllDevicesNewestData,addManyData,historicHourly,getDeviceNewestData};