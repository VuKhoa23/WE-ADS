const express = require("express");
const router = express.Router();

router.get("/home", function (req, res, next) {
  let username =  res.locals.username
  res.render("department/index", {
    API_KEY: process.env.MAP_KEY,
    role: 'Department',
    username: username
  });
});

module.exports = router;
