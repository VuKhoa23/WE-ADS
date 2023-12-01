const express = require("express");
const router = express.Router();
const Report = require("../model/reportSchema");

router.get("/details/:id", async (req, res) => {
  const id = req.params.id;
  const report = await Report.findOne({ _id: id });
  res.render("reportDetails", { content: report.content });
});

router.get("/", async (req, res) => {
  const reports = await Report.find({});
  res.render("viewReport", { reports: reports });
});

module.exports = router;
