const nodemailer = require('nodemailer');
const { createSession } = require('../middlewares/otpSession');
const User = require('../models/User');

// In-memory OTP store: { otp, expiresAt }
let pendingOtp = null;

// ─── Nodemailer transporter ───────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   // your Gmail address
      pass: process.env.EMAIL_PASS,   // Gmail App Password (not your regular password)
    },
  });
}

// ─── REQUEST OTP ──────────────────────────────────────────────────────────────
// POST /api/auth/request-otp
// No body required — just triggers OTP send to owner's email
const requestOtp = async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        message: 'Email configuration missing. Set EMAIL_USER and EMAIL_PASS in .env',
      });
    }

    // Dynamically fetch owner email from the User profile in DB
    const user = await User.findOne();
    if (!user || !user.email) {
      return res.status(404).json({
        message: 'Owner profile not found. Please create your profile first.',
      });
    }
    const ownerEmail = user.email;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    pendingOtp = { otp, expiresAt };

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Portfolio System" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: '🔐 Your Owner OTP — Portfolio Access',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border-radius: 12px; background: #f9f9f9; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-bottom: 8px;">Owner Access Request</h2>
          <p style="color: #555;">Someone requested owner access to your portfolio. If this was you, use the OTP below:</p>
          <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #4f46e5; text-align: center; margin: 28px 0;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px;">This OTP expires in <strong>10 minutes</strong>. If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    console.log(`OTP sent to ${ownerEmail}`);

    res.status(200).json({ message: 'OTP sent to owner email.' });
  } catch (error) {
    console.error('Failed to send OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP. Check email credentials.', error: error.message });
  }
};

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Body: { otp: "123456" }
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    if (!pendingOtp) {
      return res.status(400).json({ message: 'No OTP requested. Please request one first.' });
    }

    if (Date.now() > pendingOtp.expiresAt) {
      pendingOtp = null;
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (otp.toString() !== pendingOtp.otp) {
      return res.status(401).json({ message: 'Incorrect OTP. Please try again.' });
    }

    // OTP correct — clear it and create a session
    pendingOtp = null;
    const sessionToken = createSession();

    res.status(200).json({
      message: 'OTP verified. Owner session started.',
      sessionToken,             // frontend stores this and sends as X-Session-Token header
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { requestOtp, verifyOtp };
