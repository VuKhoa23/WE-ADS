const jwt = require("jsonwebtoken");
const Officer = require("../model/officer")


const checkUser = function (req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_TOKEN,
      async function (err, decodedToken) {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          console.log(decodedToken);
          let user = await Officer.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {checkUser};