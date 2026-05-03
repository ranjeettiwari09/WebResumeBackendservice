const express = require("express");
const router = express.Router();
const { otpProtected } = require("../middlewares/otpSession");
const skillController = require("../controller/skillController");

// PUBLIC — anyone can view
router.get("/", skillController.getSkills);
router.get("/:id", skillController.getSkillById);

// OWNER ONLY — OTP session required
router.post("/", otpProtected, skillController.createSkill);
router.put("/:id", otpProtected, skillController.updateSkill);
router.delete("/:id", otpProtected, skillController.deleteSkill);

module.exports = router;