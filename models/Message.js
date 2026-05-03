const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true,
        trim: true
    },
    senderEmail: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
