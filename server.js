// ─── Load environment variables FIRST — before ANY other require() ───────────
const dotenv = require('dotenv');
dotenv.config();
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./middlewares/db');
const { configureCloudinary } = require('./middlewares/cloudnary');

// Configure Cloudinary (env is already loaded above)
configureCloudinary();

// DB connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (required AFTER dotenv + cloudinary config so upload.js gets live credentials)
const ProfileRouter    = require('./Routes/userRoutes');
const projectRoutes    = require('./Routes/projectRoutes');
const skillRoutes      = require('./Routes/skillRooutes');
const educationRoutes  = require('./Routes/educationRoutes');
const experienceRoutes = require('./Routes/experienceRoutes');
const messageRoutes    = require('./Routes/messageRoutes');
const otpRoutes        = require('./Routes/otpRoutes');

app.use('/api/profile',    ProfileRouter);
app.use('/api/projects',   projectRoutes);
app.use('/api/skills',     skillRoutes);
app.use('/api/education',  educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/messages',   messageRoutes);
app.use('/api/auth',       otpRoutes);

// ─── Global error handler (catches Multer / Cloudinary / route errors) ────────
function errorMessage(err) {
  if (err == null) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  if (err.error && typeof err.error === 'object' && err.error.message) {
    return err.error.message;
  }
  try { return JSON.stringify(err); } catch { return String(err); }
}

app.use((err, req, res, _next) => {
  console.error('Server error:', err?.message || err);
  const status = err.status || err.statusCode || err.http_code || 500;
  const code   = err.code;
  const clientStatus =
    status >= 400 && status < 600
      ? status
      : code === 'LIMIT_FILE_SIZE' || code === 'LIMIT_UNEXPECTED_FILE'
        ? 400
        : 500;
  res.status(clientStatus).json({
    message: errorMessage(err),
    ...(code && { code }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
