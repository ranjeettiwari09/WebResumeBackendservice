/**
 * OTP Session Middleware
 *
 * Instead of JWT, we use a simple in-memory OTP session.
 * When the owner verifies their OTP, we store a session token in memory
 * with an expiry. All owner-only routes check this session.
 *
 * NOTE: In-memory means sessions reset on server restart.
 * For production consider storing in Redis or MongoDB.
 */

const activeSessions = new Map(); // token -> expiresAt

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Create a new owner session and return the session token.
 */
function createSession() {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  activeSessions.set(token, expiresAt);
  return token;
}

/**
 * Validate a session token.
 */
function isValidSession(token) {
  if (!token) return false;
  const expiresAt = activeSessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

/**
 * Middleware: protect owner-only routes.
 * Frontend must pass  X-Session-Token: <token>  header.
 */
function otpProtected(req, res, next) {
  const token = req.headers['x-session-token'];
  if (!isValidSession(token)) {
    return res.status(401).json({ message: 'Owner session required. Please verify OTP first.' });
  }
  next();
}

/**
 * Invalidate (logout) a session.
 */
function destroySession(token) {
  activeSessions.delete(token);
}

module.exports = { createSession, isValidSession, otpProtected, destroySession };
