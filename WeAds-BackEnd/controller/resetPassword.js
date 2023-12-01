const User = require('../model/userSchema');
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
    const user = await User.findOne({ email: email });

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

//validate the reset password request of user
module.exports.validateRequest = async (req, res, next) => {
  const { email } =  req.body;

  //missing email information
  if (!email) {
    res.status(400).json({success: false, message: 'Missing user email'})
    return;
  } 

  try {
    const user = await User.findOne({email: email});

    //email is not registered
    if (!user) {
      res.status(404).json({success: false, notExist: true, message: 'Email is not registered by any user'});
      return;
    }

    //account info, user's name for sending email
    req.user = user.username;
    req.email_to = email;

    next(); // call next middleware 
  }
  catch (err) {
    console.log(err.message);
    res.status(400).json({success: false, message: err.message});
  }
};

module.exports.createCode = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.email_to});
    const code = generateCode();

    if (!user) {
      console.log('Error in creating code: user not found');
      res.status(404).json({success: false, message:'User not found'});
      return;
    }

    //add code to request to pass to next middleware
    req.code = code;
    //add code to account document
    user.resetCode = code;
    const email = req.email_to;

    await user.save();
    //making code expired
    setTimeout(() => {codeExpire(email, code)}, parseInt(process.env.EMAIL_EXPIRE_TIME, 10) * 1000);
    next();
  }
  catch (err) {
    console.log(err.message);
    res.status(400).json({success: false, message: err.message});
  }
};

module.exports.verifyCode = async (req, res, next) => {
  const { code, email_to } = req.body;

  if (!code) {
    res.status(400).json({success: false, message: 'Missing code'});
    return;
  }

  if (!email_to) {
    res.status(400).json({success: false, message: 'Missing email'});
    return;
  }

  try {
    const user = await User.findOne({email: email_to});
    
    if (!user) {
      res.status(404).json({success: false, message: 'user not found'});
      return;
    }

    if (!user.resetCode) {
      res.status(404).json({success: false, message: 'Code is expired/removed'});
      return;
    }

    if (user.resetCode === code) {
      user.resetCode = undefined;
      await user.save();
      res.status(200).json({success: true, message: 'Code is correct, let user change password'});
    }
    else 
      res.status(400).json({success: false, message: 'Code is incorrect'});
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({success: false, message: err.message});
  }
};