const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp } = require('../controller/otpController');
const { destroySession } = require('../middlewares/otpSession');

// POST /api/auth/request-otp  — sends OTP to owner's email
router.post('/request-otp', requestOtp);

// POST /api/auth/verify-otp   — verifies OTP, returns sessionToken
router.post('/verify-otp', verifyOtp);

// POST /api/auth/logout  — invalidates the owner session server-side
router.post('/logout', (req, res) => {
  const token = req.headers['x-session-token'];
  if (token) destroySession(token);
  res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
