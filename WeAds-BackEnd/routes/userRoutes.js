const express = require("express");
const router = express.Router();

router.get("/home", function (req, res, next) {
  let username = null
  if(res.locals.user){
    username = res.locals.user.username
  }
  res.render("department/index", {
    API_KEY: process.env.MAP_KEY,
    role: 'Department',
    username: username
  });
});

module.exports = router;
