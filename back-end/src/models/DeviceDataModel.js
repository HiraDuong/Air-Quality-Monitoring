const mongoose = require('mongoose');

const DeviceDataSchema = new mongoose.Schema({
    device_id: {
        type: String,
        default: "abc123"
    },
    username: {
        type: String,
        default: "admin"
    },
    password: {
        type: String,
        default: "admin"
    },
    sensor_data: {
        humid: {
            type: Number,
            
        },
        temp: {
            type: Number,
            
        },
        ppm: {
            type: Number,
            
        },
        dustDensity: {
            type: Number,
            
        }
    }
});

module.exports = mongoose.model('DeviceDataModel', DeviceDataSchema);
