const express = require('express');
const controller = require('../controller/officerController');
const router = express.Router();

router.post('/', controller.createAccount);

module.exports = router;