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

router.get("/officer/:district", async (req, res)=>{
  const district = req.params.district
  console.log(district)
  const reports = await Report.find({district: district, reportCode: 2})
  res.json(reports)
})

router.get("/officer/:district/:ward", async (req, res)=>{
  const district = req.params.district
  const ward = req.params.ward
  console.log(district, ward)
  const reports = await Report.find({district: district, ward: ward, reportCode: 2})
  res.json(reports)
})

module.exports = router;