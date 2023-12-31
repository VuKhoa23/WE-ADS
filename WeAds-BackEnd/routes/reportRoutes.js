const express = require("express");
const router = express.Router();
const Report = require("../model/report");
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
  res.render("department/viewReport", { 
    reports: reports, 
    role: res.locals.user.role,
    username: res.locals.user.username
  });
});

module.exports = router;
