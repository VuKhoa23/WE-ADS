const express = require("express");
const router = express.Router();

router.get("/home", function (req, res, next) {
  res.render("index", {
    API_KEY: process.env.MAP_KEY,
  });
});

router.get("/report/:placeId", async function (req, res, next) {
  try{
    const response = await fetch("http://localhost:3000/weads/place/details/" + req.params.placeId)
    const result = await response.json()
    const coordinates = result.place.coordinates
    console.log(result)
    res.render("report", {
      coordinates: coordinates,
      ward: result.place.ward,
      district: result.place.district,
      placeId: result.place._id,
      adId: null,
      API_KEY: process.env.MAP_KEY,
      reportCode: 0
    });
  }catch(e){
    res.send("ERROR")
  }
 
});

router.get("/report/:placeId/:adId", async function (req, res, next) {
  const placeRes = await fetch("http://localhost:3000/weads/place/details/" + req.params.placeId)
  const placeResult = await placeRes.json()
  const coordinates = placeResult.place.coordinates

  const adRes = await fetch("http://localhost:3000/weads/ad/details/" + req.params.adId)
  const adResult = await adRes.json()

  res.render("report", {
    coordinates: coordinates,
    ward: placeResult.place.ward,
    district: placeResult.place.district,
    placeId: placeResult.place._id,
    API_KEY: process.env.MAP_KEY,
    reportCode: 1,
    adId: adResult.ad._id
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
  const response = await fetch("http://127.0.0.1:3000/api/weads-admin/report/" + req.params.id)
  const result = await response.json()
  console.log(result)
  res.render("reportDetails", {
    report: result
  });
});

module.exports = router;
