const express = require('express');
const router = express.Router();
const { otpProtected } = require('../middlewares/otpSession');
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controller/messageController');

// PUBLIC — anyone can drop a message
router.post('/', sendMessage);

// OWNER ONLY — requires valid OTP session
router.get('/', otpProtected, getMessages);
router.patch('/:id/read', otpProtected, markAsRead);
router.delete('/:id', otpProtected, deleteMessage);

module.exports = router;
