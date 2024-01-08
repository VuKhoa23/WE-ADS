const jwt = require('jsonwebtoken')
const Officer = require("../model/officer")


const maxAge = 3 * 24 * 60 * 60;

const createToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: maxAge,
  });
};

module.exports.createToken = async (req, res, next) => {
  const officer = await Officer.findOne({
    email: req.user.emails[0].value
  })
  if(officer){
    const token = createToken(officer._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect('/weads/home')
  }
  else{
    res.cookie("loginErr", "Tài khoản Gmail không liên kết với bất kỳ tài khoản nào", { maxAge: 60 * 60 * 1000 });
    res.redirect("/weads/login")
  }
};
