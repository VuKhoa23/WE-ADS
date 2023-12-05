const Officer = require('../model/officer');
// var ObjectId = (require('mongoose').Types.ObjectId);

module.exports.createAccount = async (req, res, next) => {
  const { username, password, name, birthday, email, phone, role } = req.body;
  try {
    const request = await Officer.create({  username, password, name, birthday, email, phone, role });
    res.status(201).json({success: true});
  }
  catch (err) {
    console.error(err.message);
    res.status(400).json({success: false, message: err.message});
  }
};
