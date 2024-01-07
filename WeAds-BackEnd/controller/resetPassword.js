const Officer = require('../model/officer');
require('dotenv').config();

//function to create verification code
const generateCode = () => {
  const range = '0123456789';
  const length =  parseInt(process.env.VERIFICATION_CODE_LENGTH, 10);
  let code = '';

  for (let i = 0; i < length; i++) {
    code = code + range.charAt(Math.floor(Math.random() * range.length)); // get a random character from range string
  }

  return code;
};

const codeExpire = async (email , code) => {
  try {
    const user = await Officer.findOne({ email: email });

    if (!user) 
      return;

    //if reset password code is somehow removed before(user has entered it on the website and successfully changed password, etc..), return
    if (!user.resetCode) 
      return;
    
    //if the reset password code is changed(resend code), return
    if (user.resetCode !== code)
      return;

    user.resetCode = undefined;
    await user.save();
    console.log(`The reset password code sent to ${email} has expired`);
  }
  catch (err) {
    console.log('Error in making verification code expire:\n')
    console.log(err.message);
  }
};

//validate the reset password request of user and create code in database
module.exports.preprocess = async (req, res, next) => {
  const { email } =  req.body;
  const code = generateCode();

  //missing email information
  if (!email) {
    res.cookie("sendCodeErr", "Vui lòng nhập email", { maxAge: 60 * 60 });
    res.redirect('/weads/forget-password');
    return;
  } 

  try {
    const user = await Officer.findOne({email: email});

    //email is not registered
    if (!user) {
      res.cookie("sendCodeErr", "Không tìm thấy tài khoản liên kết với email này", { maxAge: 60 * 60 * 1000 });
      res.redirect('/weads/forget-password');
      return;
    }

    if (user.resetCode) {
      res.redirect('/weads/forget-password/verify');
      return;
    }

    //account info, user's name for sending email
    req.user = user.name;
    req.email_to = email;
    //add code to request to pass to next middleware
    req.code = code;
    //add code to account document
    user.resetCode = code;

    await user.save();
    //making code expire
    setTimeout(() => {codeExpire(email, code)}, parseInt(process.env.EMAIL_EXPIRE_TIME, 10) * 1000);
    //save reset email to cookie
    res.cookie("resetEmail", email, { maxAge: 60 * 60 * 24 * 1000});
    next(); // call next middleware 
  }
  catch (err) {
    console.log(err.message);
    res.cookie("sendCodeErr", "Có lỗi xảy ra, vui lòng thử lại", { maxAge: 60 * 60 * 1000 });
    res.redirect('/weads/forget-password');
    return;
  }
};

module.exports.verifyCode = async (req, res, next) => {
  const { code, email } = req.body;

  if (!code) {
    res.cookie("verifyCodeErr", "Vui lòng thử lại", { maxAge: 60 * 60 * 1000 });
    res.redirect('/weads/forget-password/verify');
    return;
  }

  if (!email) {
    res.cookie("verifyCodeErr", "Vui lòng thử lại", { maxAge: 60 * 60 * 1000 });
    res.redirect('/weads/forget-password/verify');
    return;
  }

  try {
    const user = await Officer.findOne({email: email});
    
    if (!user) {
      res.cookie("sendCodeErr", "Không tìm thấy tài khoản liên kết với email này, vui lòng thử lại", { maxAge: 60 * 60 * 1000 });
      res.redirect('/weads/forget-password');
      return;
    }

    if (!user.resetCode) {
      res.cookie("sendCodeErr", "Mã xác nhận quá hạn, vui lòng gửi lại mã", { maxAge: 60 * 60 * 1000 });
      res.redirect('/weads/forget-password');
      return;
    }

    if (user.resetCode == code) {
      user.resetCode = undefined;
      user.changePassword = true;
      await user.save();
      res.redirect(`/weads/forget-password/${user._id}/change-password`);
    }
    else {
      res.cookie("verifyCodeErr", "Mã xác nhận không đúng", { maxAge: 60 * 60 * 1000 });
      res.redirect('/weads/forget-password/verify');
    }
  }
  catch (err) {
    console.log(err.message);
    res.cookie("verifyCodeErr", "Có lỗi xảy ra, vui lòng thử lại", { maxAge: 60 * 60 * 1000 });
    res.redirect('/weads/forget-password/verify');
    return;
  }
};