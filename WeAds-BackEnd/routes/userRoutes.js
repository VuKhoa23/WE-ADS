const express = require("express");
const router = express.Router();

router.get("/home", function (req, res, next) {
  let username = "Not logged in"
  if(res.locals.username != null){
    username = res.locals.username
  }
  res.render("index", {
    API_KEY: process.env.MAP_KEY,
    role: 'Department',
    username: username
  });
});

module.exports = router;
