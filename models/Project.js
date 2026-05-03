const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
    title: {
        type: String,     
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageVedio: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectsSchema);