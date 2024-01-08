const express = require("express");
const router = express.Router();

router.get("/home", function (req, res, next) {
  res.render("index", {
    API_KEY: process.env.MAP_KEY,
  });
});

router.get("/report/:placeIndex", function (req, res, next) {
  const placeIndex = req.params.placeIndex;
  res.render("report", {
    placeIndex: placeIndex,
    API_KEY: process.env.MAP_KEY,
  });
});

router.get("/report", function (req, res, next) {
  console.log(req.query)
  res.send("OK")
});


module.exports = router;
