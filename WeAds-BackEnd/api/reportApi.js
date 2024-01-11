const express = require('express');
const controller = require('../controller/reportController');
const router = express.Router();

router.post('/', controller.createReport);
router.get('/:id', controller.getReport);
router.post('/update', controller.updateState);

module.exports = router;