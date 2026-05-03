const mongoose = require('mongoose');

const userSkills = new mongoose.Schema({   
    skill: {
        type: String,
        required: true
    },
    proficiency: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Skills', userSkills);