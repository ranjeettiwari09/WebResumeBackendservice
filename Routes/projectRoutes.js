const express = require("express");
const router = express.Router();
const { otpProtected } = require("../middlewares/otpSession");
const upload = require("../middlewares/upload");
const projectController = require("../controller/projectController");

// PUBLIC — anyone can view
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);

// OWNER ONLY — OTP session required
router.post("/", otpProtected, upload.single("imageVedio"), projectController.createProject);
router.put("/:id", otpProtected, upload.single("imageVedio"), projectController.updateProject);
router.delete("/:id", otpProtected, projectController.deleteProject);

module.exports = router;
