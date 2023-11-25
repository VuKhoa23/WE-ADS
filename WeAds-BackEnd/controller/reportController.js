const Report = require('../model/reportSchema');

//create new report
module.exports.createReport = async (req, res, next) => {
  const { name, reportType, email, phone, content, address} = req.body;
  let state = false;

  try {
    const report = await Report.create({ name, reportType, email, phone, content, address, state });
    res.status(201).json({success: true});
  }
  catch (err) {
    console.error(err.message);
    res.status(400).json({success: false, message: err.message});
  }
};

module.exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find({});

    //get create time from document and add it to the results
    const results = reports.map(report => {
      const timeStamp = new Date(report.createdAt);
      return {
        ...report._doc,
        createTime: `${timeStamp.getDate()}/${timeStamp.getMonth() + 1}/${timeStamp.getFullYear()}`
      }
    });
    res.status(200).json({success: true, reports: results});
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({success: false, message: err.message});
  }
};

//update report state
module.exports.updateState = async (req, res, next) => {
  try {
    const { id , state, information } =  req.body;

    if (!information || information.length === 0) {
      res.status(400).json({success: false, message: "Update information is missing"})
    }

    let doc = await Report.findOneAndUpdate({ id: ObjectId(id) }, {
      state: state,
      information: information
    })
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({success: false, message: err.message});
  }
};