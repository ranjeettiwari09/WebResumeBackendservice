const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./cloudnary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    // PROFILE IMAGE
    if (file.fieldname === "profilePicture") {
      return {
        folder: "portfolio/profile",
        resource_type: "image",
      };
    }

    // RESUME (PDF/DOC)
    if (file.fieldname === "resume") {
      return {
        folder: "portfolio/resume",
        resource_type: "raw",
      };
    }

    // PROJECT MEDIA (image or video)
    if (file.fieldname === "imageVedio") {
      if (file.mimetype.startsWith("video")) {
        return {
          folder: "portfolio/projects",
          resource_type: "video",
        };
      }
      // Default: image
      return {
        folder: "portfolio/projects",
        resource_type: "image",
      };
    }

    // DEFAULT fallback
    return {
      folder: "portfolio/misc",
      resource_type: "auto",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;