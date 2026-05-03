const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: 'Full Stack Developer & Problem Solver'
    },
    bio: {
        type: String,
        default: 'Passionate full stack developer who loves building modern, scalable web applications. I enjoy turning complex problems into elegant solutions with clean code and great user experiences.'
    },
    location: {
        type: String,
        default: 'India'
    },
    profilePicture: {
        type: String,
        default: ''
    },
    resume: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);