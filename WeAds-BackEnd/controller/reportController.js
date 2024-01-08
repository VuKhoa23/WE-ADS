const Report = require("../model/report");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getReportById = async (id) => {
  const report = await Report.findOne({ _id: id });
  return report;
};

//create new report
module.exports.createReport = async (req, res, next) => {
  let { name, reportType, email, phone, content, address, ward, district, placeId, adId} = req.body;
  let state = false;
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
      adId
    });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ success: false, message: err.message });
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
