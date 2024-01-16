const NodeMailer = require('nodemailer');
const passwordTemplate = require('../template/forgetPassword.json');
const resultTemplate = require('../template/reportResult.json');
const announceTemplate = require('../template/reportAnnounce.json');
const updateTemplate = require('../template/updateReqAnnounce.json');
require('dotenv').config();


const populatePasswordEmail = (template, user, code) => {
  //replace the placeholders in the template with request data
  let result = template.replace("<user>", user);
  result = result.replace("<code>", code);
  result = result.replace("<expire>", process.env.EMAIL_EXPIRE_TIME);
  result = result.replace("<support>", process.env.EMAIL_SUPPORT);
  return result;
};

const populateResultEmail = (template, name, address, result) => {
  //replace the placeholders in the template with request data
  let resultBody = template.replace("<name>", name);
  resultBody = resultBody.replace("<address>", address);
  resultBody = resultBody.replace("<result>", result);
  resultBody = resultBody.replace("<support>", process.env.EMAIL_SUPPORT);
  return resultBody;
};

const populateUpdateEmail = (template, name, type, address, state) => {
  let resultBody = template.replace("<name>", name);
  resultBody = resultBody.replace("<address>", address);
  resultBody = resultBody.replace("<type>", type);
  resultBody = resultBody.replace("<state>", state);
  resultBody = resultBody.replace("<state>", state);
  return resultBody;
};

module.exports.sendCode = (req, res, next) => {
  let transporter = NodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === 465 ? true : false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: req.email_to,
    subject: passwordTemplate.subject,
    html: populatePasswordEmail(passwordTemplate.body, req.user, req.code),
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.cookie("sendCodeErr", "Có lỗi xảy ra, vui lòng thử lại", { maxAge: 60 * 60 });
      res.redirect('/weads/forget-password');
    } else {
      console.log('Reset password code sent: ' + info.response);
      res.redirect('/weads/forget-password/verify');
    }
  });
};

module.exports.sendReportResult = (req, res, next) => {
  if (!req.receiver || !req.name || !req.address || !req.result) {
    res.status(500).json({ success: false, error: "Missing information"});
    return;
  }
  let transporter = NodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === 465 ? true : false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: req.receiver,//destination email
    subject: resultTemplate.subject,
    html: populateResultEmail(resultTemplate.body, req.name, req.address, req.result)
    //name: reporter name; address: address of the billboard; result: result of the report
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error.message});
    } else {
      res.status(200).json({ success: true });
    }
  });
};

module.exports.sendReportState = (req, res, next) => {
  if (!req.receiver || !req.name || !req.address) {
    res.status(500).json({ success: false, error: "Missing information"});
    return;
  }
  let transporter = NodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === 465 ? true : false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: req.receiver,//destination email
    subject: announceTemplate.subject,
    html: populateResultEmail(announceTemplate.body, req.name, req.address, "")
    //name: reporter name; address: address of the billboard
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error.message});
    } else {
      res.status(200).json({ success: true });
    }
  });
};

module.exports.sendUpdateAnnounce = (req, res, next) => {
  console.log(req.receiver, req.name, req.address, req.type, req.state);
  if (!req.receiver || !req.name || !req.address || !req.type || !req.state) {
    res.status(500).json({ success: false, error: "Missing information"});
    return;
  }
  let transporter = NodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === 465 ? true : false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: req.receiver,//destination email
    subject: updateTemplate.subject,
    html: populateUpdateEmail(updateTemplate.body, req.name, req.type, req.address, req.state)
    //name: reporter name; address: address of the billboard
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error.message});
    } else {
      res.status(200).json({ success: true });
    }
  });
};