const express = require("express");
const router = express.Router();
const Report = require("../model/report");
const controller = require("../controller/reportController");

router.get("/details/:id", async (req, res) => {
  const id = req.params.id;
  const report = await controller.getReportById(id);
  res.render("department/reportDetails", { content: report.content });
});

router.get("/", async (req, res) => {
  const reports = await controller.getAllReports();
  res.render("department/viewReport", { 
    reports: reports, 
    role: "Department" 
  });
});

module.exports = router;
