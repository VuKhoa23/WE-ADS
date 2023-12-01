const UpdateReq = require('../model/updateReqSchema');
var ObjectId = (require('mongoose').Types.ObjectId);

module.exports.createRequest = async (req, res, next) => {
  const { address, location, locationType, adsType, images, organized } = req.body;
  let processed = false;
  try {
    const request = await UpdateReq.create({ address, location, locationType, adsType, images, organized, processed });
    res.status(201).json({success: true});
  }
  catch (err) {
    console.error(err.message);
    res.status(400).json({success: false, message: err.message});
  }
};

module.exports.getAllRequests = async (req, res, next) => {
  try {
    // Retrieve all pending requests.
    const requests = await UpdateReq.findAll({processed: false});

    //get create time from document and add it to the results
    const results = requests.map(request => {
      const timeStamp = new Date(request.createdAt);
      return {
        ...request._doc,
        createTime: `${timeStamp.getDate()}/${timeStamp.getMonth() + 1}/${timeStamp.getFullYear()}`
      }
    });
    res.status(200).json({success: true, requests: results});
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({success: false, message: err.message});
  }
};

module.exports.updateRequest = async (req, res, next) => {
  const { id, state } = req.body;
  try {
    let doc = UpdateReq.findAndUpdate({_id: new ObjectId(id)},{processed: state});
    res.status(200).json({success: true});
  } 
  catch (err) {
    console.log(err.message);
    res.status(500).json({success: false, message: err.message});
  }
};