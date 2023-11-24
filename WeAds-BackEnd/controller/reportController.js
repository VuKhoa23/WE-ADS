const Report = require('../model/reportSchema');

//create new report
module.exports.createReport = async (req, res, next) => {
  const { name, reportType, email, phone, content} = req.body;
  // let name = 'Nguyễn Thuận Phát'
  // let reportType = 'Tố giác sai phạm'
  // let email = 'user@gmail.com'
  // let phone = '0978123456'
  // let content = 'Hình ảnh quảng sai quy định'
  console.log("Creating");
  try {
    const report = await Report.create({ name, reportType, email, phone, content});
    res.status(200).json({success: true});
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({success: false, message: err.message});
  }
};

module.exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find({});
    res.status(200).json({success: true, reports});
  }
  catch (err) {
    console.error(err.message);
  }
};