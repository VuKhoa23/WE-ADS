const UserInfo = require('../model/userInfoSchema'); 
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

const codeExpire = async (username , code) => {
  try {
    const user = User.findOne({ username: username });

    if (!user) {
      console.log('codeExpire: cannot find user');
      return;
    }

    //if reset password code is somehow removed before(user has entered it on the website and successfully changed password, etc..), return
    if (!user.resetCode) 
      return;
    
    //if the reset password code is changed(resend code), return
    if (user.resetCode !== code)
      return;

    user.resetCode = undefined;
    await user.save();
    console.log(`The reset password code for account with username "${user.username}" has expired`);
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
  }

  try {
    const user = await UserInfo.findOne({email: email}).populate('username');

    //email is not registered
    if (!user) {
      res.status(404).json({success: false, message: 'Email is not registered by any user'});
    }

    //add account username to request foe next middleware to find
    req.username = user.account.username;
    //account info, user's name for sending email
    req.user = user.name;
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
    const user = await User.findOne({username: req.username});
    const code = generateCode();

    //add code to request to pass to next middleware
    req.code = code;
    //add code to account document
    user.resetCode = code;
    await user.save();

    //making code expired
    setTimeout(codeExpire, process.env.EMAIL_EXPIRE_TIME);

    next();
  }
  catch (err) {
    console.log(err.message);
    res.status(400).json({success: false, message: err.message});
  }
};

module.exports.verifyCode = async (req, res, next) => {
  const { code, username } = req.body;

  if (!code) {
    console.log('verifyCode: missing code');
    res.status(400).json({success: false, message: 'Missing code'});
  }

  if (!username) {
    console.log('verifyCode: missing username');
    res.status(400).json({success: false, message: 'Missing username'});
  }

  try {
    const user = User.findOne({username: username});
    
    if (!user) {
      console.log('verifyCode: user not found');
      res.status(404).json({success: false, message: 'user not found'});
    }

    if (!user.resetCode) {
      console.log('verifyCode: code is expired/not found');
      res.status(404).json({success: false, message: 'Code is expired/removed'});
    }

    if (user.resetCode === code) {
      res.status(200).json({success: true, message: 'Code is correct'});
      codeExpire(username, code);
    }
    else 
      res.status(400).json({success: false, message: 'Code is incorrect'});
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({success: false, message: err.message});
  }
};