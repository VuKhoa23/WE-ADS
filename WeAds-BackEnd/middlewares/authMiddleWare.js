const jwt = require("jsonwebtoken");

const checkUser = function (req, res, next) {
  const token = req.cookies.jwt;

  // check if jwt exists & verified
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_TOKEN,
      async function (err, decodedToken) {
        if (err) {
          console.log(err.message);
          res.locals.username = null;
          next();
        } else {
          console.log(decodedToken);
          res.locals.username = decodedToken.username;
          next();
        }
      }
    );
  } else {
    console.log("No token")
    res.locals.username = null;
    next();
  }
};

module.exports = {checkUser};