const mongoose = require('mongoose');

const Data = {
    weather: {
        type: String,
        required: true
    },
    temp: {
        type: Number,
        required: true
    },
    humid: {
        type: Number,
        required: true
    },
    aqi: {
        type: Number,
        required: true
    },
    ppm: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
}

const DeviceData = {

   deviceId: {
      type: Number,
      required: true
   },
    location: {
        type: String,
        required: true
    },

   data:{
    type : [Data],
    required: true
   }
};

module.exports = mongoose.model('devices', DeviceData);