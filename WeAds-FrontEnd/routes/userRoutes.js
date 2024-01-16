const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/home", function (req, res, next) {
  res.render("index", {
    API_KEY: process.env.MAP_KEY,
  });
});

router.get("/report/:placeId", async function (req, res, next) {
    // const response = await fetch(process.env.API + "/weads/place/details/" + req.params.placeId)
    // const result = await response.json()
    // const coordinates = result.place.coordinates
    res.render("report", {
      // coordinates: coordinates,
      // ward: result.place.ward,
      // district: result.place.district,
      placeId: req.params.placeId,
      API_KEY: process.env.MAP_KEY,
      reportCode: 0,
      coordinates: null,
      ward: null,
      district: null,
      adId: null
    });

 
});

router.get("/report/:placeId/:adId", async function (req, res, next) {
  res.render("report", {
    placeId: req.params.placeId,
    API_KEY: process.env.MAP_KEY,
    reportCode: 1,
    adId : req.params.adId,
    coordinates: null,
    ward: null,
    district: null
  });
});


router.get("/report", async function (req, res, next) {
  let coordinates = []
  coordinates.push(req.query.lng)
  coordinates.push(req.query.lat)
  res.render("report", {
    coordinates: coordinates,
    ward: req.query.ward,
    district: req.query.district,
    placeId: null,
    API_KEY: process.env.MAP_KEY,
    reportCode: 2,
    adId: null
  });
});

router.get("/view-report/:id", async function (req, res, next) {
  res.render("reportDetails",{
    id: req.params.id
  });
});

module.exports = router;
