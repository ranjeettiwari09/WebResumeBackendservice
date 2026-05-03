const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,   
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        required: true  
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);