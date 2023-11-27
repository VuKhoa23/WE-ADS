const express = require("express");
const router = express.Router();

router.get("/home", function (req, res, next) {
  res.render("index", {
    API_KEY: process.env.MAP_KEY,
  });
});

router.get("/test", function (req, res, next) {
  res.render("test", {
    API_KEY: process.env.MAP_KEY,
  });
});

module.exports = router;
