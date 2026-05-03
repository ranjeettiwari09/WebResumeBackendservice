// middlewares/cloudnary.js
const cloudinary = require("cloudinary").v2;

/**
 * Configure Cloudinary with signed credentials.
 * Uses CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET from .env
 * 
 * ⚠️  Do NOT use upload_preset here — presets are for unsigned client uploads only.
 * ⚠️  Do NOT call cloudinary.config(true) — it reads ALL env vars and can corrupt config.
 */
const configureCloudinary = () => {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const api_key    = (process.env.CLOUDINARY_API_KEY    || "").trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || "").trim();

  if (!cloud_name || !api_key || !api_secret) {
    console.error(
      "❌ Cloudinary: Missing credentials in .env\n" +
      "   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    );
    return;
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

  // Verify credentials actually work with a ping
  cloudinary.api.ping()
    .then(() => console.log("✅ Cloudinary configured and credentials verified"))
    .catch((err) => {
      const msg = err?.error?.message || err?.message || JSON.stringify(err);
      console.error(`❌ Cloudinary credentials INVALID: ${msg}`);
      console.error("   → Go to https://console.cloudinary.com → Dashboard → API Keys");
      console.error("   → Copy cloud_name, api_key, and api_secret into your .env file");
    });
};

module.exports = { cloudinary, configureCloudinary };
