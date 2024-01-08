const express = require("express");
const router = express.Router();

router.get("/:index", function (req, res, next) {
  res.render("update-form", {
    role: res.locals.user.role,
    username: res.locals.user.username,
    placeIndex: req.params.index,
    API_KEY: process.env.MAP_KEY,
  })
});

router.get("/:index/:adIndex", function (req, res, next) {
  res.send(req.params.index + "-" + req.params.adIndex)
});

module.exports = router;
