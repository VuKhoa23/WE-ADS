const express = require('express');
const router = express.Router();
const passwordController = require('../controller/resetPassword');
const emailController = require('../controller/emailController');

router.post('/', passwordController.validateRequest, passwordController.createCode, emailController.sendMail);
router.post('/verify', passwordController.verifyCode);

module.exports = router;