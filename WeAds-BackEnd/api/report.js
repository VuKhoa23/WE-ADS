const express = require('express');
const controller = require('../controller/reportController');
const router = express.Router();

router.get('/', controller.getAllReports);
router.post('/', controller.createReport);
router.post('/update', controller.updateState);

module.exports = router;