const express = require("express");
const router = express.Router();
const Report = require("../model/report");
const Ward = require("../model/ward");
const District = require("../model/district");
const controller = require("../controller/reportController");

router.get("/details/:id", async (req, res) => {
  const id = req.params.id;
  const report = await controller.getReportById(id);
  res.render("department/reportDetails", { report });
});

router.get("/", async (req, res) => {
  let reports = null
  if(res.locals.user.role === 'District'){
    reports = await Report.find({district: res.locals.user.district})
  }
  else if(res.locals.user.role === 'Ward'){
    reports = await Report.find({ward: res.locals.user.ward})
  }
  else {
    reports = await Report.find({})
  }

  const district = await District.findOne({name: res.locals.user.district});
  console.log(district);
  const wards = await Ward.find({district: district._id});
  console.log(wards);
  res.render("department/viewReport", { 
    reports: reports, 
    wards: wards,
    role: res.locals.user.role,
    username: res.locals.user.username
  });
});

router.get("/ward/:val", async (req, res) => {
  const val = req.params.val;

  let reports = null;
  reports = await Report.find({district: res.locals.user.district, ward: val})

  const district = await District.findOne({name: res.locals.user.district});
  console.log(district);
  const wards = await Ward.find({district: district._id});
  console.log(wards);

  res.render("department/viewReport", { 
    reports: reports, 
    wards: wards,
    role: res.locals.user.role,
    username: res.locals.user.username
  });
});

module.exports = router;
