const express = require('express');
const controller = require('../controller/updateReqController');
const router = express.Router();

router.get('/', controller.getAllRequests);
router.post('/', controller.createRequest);
router.post('/update', controller.updateRequest);

module.exports = router;