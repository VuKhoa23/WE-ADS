const express = require('express');
const controller = require('../controller/reportController');
const router = express.Router();
const Report = require("../model/report");

router.post('/', controller.createReport);
router.get('/:id', controller.getReport);
router.post('/update', controller.updateState);
router.get("/place/:placeId", async (req, res)=>{
  const placeId = req.params.placeId
  const reports = await Report.find({placeId: placeId})
  console.log(reports)
  res.json(reports)
})

module.exports = router;