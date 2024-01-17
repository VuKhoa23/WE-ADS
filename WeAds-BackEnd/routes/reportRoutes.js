const express = require("express");
const router = express.Router();
const Report = require("../model/report");
const Ward = require("../model/ward");
const District = require("../model/district");
const ReportType = require("../model/reportType");
const controller = require("../controller/reportController");

router.get("/reportTypes", async (req, res) => {
  const reportTypes = await ReportType.find({});
  const reportTypeList = [];
  reportTypes.forEach(reportType => {
    reportTypeList.push(reportType.name);
  });
  res.json({reportTypeList});
});

router.get("/details/:id", async (req, res) => {
  const id = req.params.id;
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
  const report = await controller.getReportById(id);
  res.render("department/reportDetails", { 
    report,
    role: res.locals.user.role,
    username: res.locals.user.username
   });
});

router.get("/", async (req, res) => {
  let option = req.query.option || "all";
  let currentDistrict = res.locals.user.district || req.query.district;
  let currentWard = res.locals.user.ward || req.query.ward;
  if (currentDistrict == 'Tất cả')
    currentDistrict = undefined;
  if (currentWard == 'Tất cả')
    currentWard = undefined;
  let reports = [];

  let state = "";
  if (parseInt(option) == 0)
    state = 'Waiting';
  else if (parseInt(option) == 1)
    state = 'Processing';
  else 
    state = 'Done';

  if (currentDistrict && currentWard) {
    reports = await Report.find({ district: currentDistrict, ward: currentWard });
  }
  else if (currentDistrict && !currentWard) {
    reports = await Report.find({ district: currentDistrict });
  }
  else  {
    reports = await Report.find({});
  }

  console.log(state);
  if (option != "all") {
    reports = reports.filter(report => report.state == state);
  }

  let wardList = [];
  const districtList = await District.find({});

  if (currentDistrict) {
    wardList = await Ward.find().populate('district');
    wardList = wardList.filter(ward => {
      return ward.district.name == currentDistrict;
    });
  }
  res.render("department/viewReport", { 
    reports: reports,
    currentDistrict: currentDistrict? currentDistrict : 'Tất cả',
    districtList,
    wardList,
    option,
    currentWard: currentWard? currentWard : 'Tất cả', 
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
    option: val,
    role: res.locals.user.role,
    username: res.locals.user.username
  });
});

router.get("/department/:option", async (req, res) => {
  const option = req.params.option;
  let state = "";
  if (parseInt(option) == 0)
    state = 'Waiting';
  else if (parseInt(option) == 1)
    state = 'Processing';
  else 
    state = 'Done';
  let currentDistrict = res.locals.user.district || req.query.district;
  let currentWard = res.locals.user.ward || req.query.ward;
  let reports = [];

  if (currentDistrict && currentWard) {
    reports = await Report.find({ state, district: currentDistrict, ward: currentWard });
  }
  else if (currentDistrict && !currentWard) {
    reports = await Report.find({ state, district: currentDistrict });
  }
  else  {
    reports = await Report.find({state});
  }

  let wardList = [];
  const districtList = await District.find({});

  if (currentDistrict) {
    wardList = await Ward.find().populate('district');
    wardList = wardList.filter(ward => {
      return ward.district.name == currentDistrict;
    });
  }
  res.render("department/viewReport", { 
    reports: reports,
    currentDistrict: currentDistrict? currentDistrict : 'Tất cả',
    districtList,
    wardList,
    currentWard: currentWard? currentWard : 'Tất cả', 
    option: 'all',
    role: res.locals.user.role,
    username: res.locals.user.username
  });
});

module.exports = router;
