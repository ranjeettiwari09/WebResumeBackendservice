const express = require('express');
const router = express.Router();
const { otpProtected } = require('../middlewares/otpSession');
const educationController = require('../controller/educationController');

// PUBLIC — anyone can view
router.get('/', educationController.getEducations);
router.get('/:id', educationController.getEducationById);

// OWNER ONLY — OTP session required
router.post('/', otpProtected, educationController.createEducation);
router.put('/:id', otpProtected, educationController.updateEducation);
router.delete('/:id', otpProtected, educationController.deleteEducation);

module.exports = router;