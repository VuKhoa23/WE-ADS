const express = require("express");
const router = express.Router();

router.get("/:placeId", async function (req, res, next) {
  const placeRes = await fetch("http://localhost:3000/weads/place/details/" + req.params.placeId)
  const placeResult = await placeRes.json()
  const coordinates = placeResult.place.coordinates

  res.render("update-form", {
    role: res.locals.user.role,
    username: res.locals.user.username,
    coordinates: coordinates,
    API_KEY: process.env.MAP_KEY,
  })
});

router.get("/:index/:adIndex", function (req, res, next) {
  res.send(req.params.index + "-" + req.params.adIndex)
});

module.exports = router;
