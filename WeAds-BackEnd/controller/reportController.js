const Report = require("../model/report");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getReportById = async (id) => {
  const report = await Report.findOne({ _id: id });
  return report;
};

//create new report
module.exports.createReport = async (req, res, next) => {
  console.log("HERE")
  let { name, reportType, email, phone, content, address, ward, district, placeId, adId, reportCode, coordinates} = req.body;
  let state = "Waiting";
  if(adId === ""){
    adId = null
  }
  if(placeId === ""){
    placeId = null
  }
  try {
    const report = await Report.create({
      name,
      reportType,
      email,
      phone,
      content,
      address,
      state,
      ward,
      district,
      placeId,
      adId,
      reportCode
    });
    res.status(201).json({reportId: report._id, placeId: report.placeId, adId: report.adId, coordinates: coordinates });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ success: false, message: err.message});
  }
};

//create new report
module.exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    res.status(201).json(report);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ success: false, message: err.message});
  }
};

module.exports.getAllReports = async (req, res, next) => {
  const reports = await Report.find({});

  //get create time from document and add it to the results
  const results = reports.map((report) => {
    const timeStamp = new Date(report.createdAt);
    return {
      ...report._doc,
      createTime: `${timeStamp.getDate()}/${
        timeStamp.getMonth() + 1
      }/${timeStamp.getFullYear()}`,
    };
  });
  return results;
};

//update report state
module.exports.updateState = async (req, res, next) => {
  try {
    const { id, state, information } = req.body;

    if (!information || information.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "Update information is missing" });
    }

    let doc = await Report.findOne({ _id: new ObjectId(id) });
    doc.state = state;
    doc.information = information;

    await doc.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
