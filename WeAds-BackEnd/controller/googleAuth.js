const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60;
const createToken = function (username) {
  return jwt.sign({ username }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: maxAge,
  });
};

module.exports.createToken = async (req, res, next) => {
  const token = createToken(req.user.emails[0].value);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.redirect("/weads/home")
};
