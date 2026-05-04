const { Resend } = require('resend');
const { createSession } = require('../middlewares/otpSession');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory OTP store
let pendingOtp = null;

// ─── REQUEST OTP ─────────────────────────────────────────────
const requestOtp = async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        message: 'Resend API key missing. Set RESEND_API_KEY in .env',
      });
    }

    // Fetch owner email
    const user = await User.findOne();
    if (!user || !user.email) {
      return res.status(404).json({
        message: 'Owner profile not found. Please create your profile first.',
      });
    }

    const ownerEmail = user.email;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    pendingOtp = { otp, expiresAt };

    // Send email via Resend
    await resend.emails.send({
      from: 'Portfolio System <onboarding@resend.dev>', // replace with your verified domain later
      to: ownerEmail,
      subject: '🔐 Your Owner OTP — Portfolio Access',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border-radius: 12px; background: #f9f9f9; border: 1px solid #e0e0e0;">
          <h2 style="color: #333;">Owner Access Request</h2>
          <p style="color: #555;">Use the OTP below:</p>
          <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #4f46e5; text-align: center; margin: 28px 0;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px;">Expires in 10 minutes.</p>
        </div>
      `,
    });

    console.log(`OTP sent to ${ownerEmail}`);

    res.status(200).json({ message: 'OTP sent to owner email.' });

  } catch (error) {
    console.error('Failed to send OTP:', error);
    res.status(500).json({
      message: 'Failed to send OTP',
      error: error.message,
    });
  }
};

// ─── VERIFY OTP ─────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    if (!pendingOtp) {
      return res.status(400).json({ message: 'No OTP requested.' });
    }

    if (Date.now() > pendingOtp.expiresAt) {
      pendingOtp = null;
      return res.status(400).json({ message: 'OTP expired.' });
    }

    if (otp.toString() !== pendingOtp.otp) {
      return res.status(401).json({ message: 'Incorrect OTP.' });
    }

    pendingOtp = null;

    const sessionToken = createSession();

    res.status(200).json({
      message: 'OTP verified. Owner session started.',
      sessionToken,
    });

  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = { requestOtp, verifyOtp };