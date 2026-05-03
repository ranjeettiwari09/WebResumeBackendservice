const express = require('express');
const router = express.Router();
const { otpProtected } = require('../middlewares/otpSession');
const experienceController = require('../controller/experienceController');

// PUBLIC — anyone can view
router.get('/', experienceController.getExperiences);
router.get('/:id', experienceController.getExperienceById);

// OWNER ONLY — OTP session required
router.post('/', otpProtected, experienceController.createExperience);
router.put('/:id', otpProtected, experienceController.updateExperience);
router.delete('/:id', otpProtected, experienceController.deleteExperience);

module.exports = router;