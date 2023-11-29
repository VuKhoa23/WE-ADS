const NodeMailer = require('nodemailer');
const email = require('../template/forgetPassword.json');
require('dotenv').config();


const populateBody = (template, user, code) => {
  //replace the placeholders in the template with request data
  let result = template.replace("<user>", user);
  result = result.replace("<code>", code);
  result = result.replace("<expire>", process.env.EMAIL_EXPIRE_TIME);
  result = result.replace("<support>", process.env.EMAIL_SUPPORT);
  return result;
};

// module.exports.testmdw = (req, res, next) => {
//   const { user, email_to } = req.body;
//   if (!user || !email_to)
//     res.json({error: 'missing email information'});
//   req.user = user;
//   req.email_to = email_to;
//   next();
// }

module.exports.sendMail = (req, res, next) => {
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
    subject: email.subject,
    text: populateBody(email.body, req.user, req.code)
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).json({success: false, message: "Error sending email"})
    } else {
      console.log('Reset password code sent: ' + info.response);
      res.status(200).json({success: true, message: "Email sent successfully", email: req.email_to});
    }
  });
};