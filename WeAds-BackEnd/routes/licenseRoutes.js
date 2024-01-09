const express = require('express');
const Place = require("../model/places");
const Ad = require("../model/ads");
const Router = express.Router();

Router.get('/create/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.redirect('/weads/place/view-all');
    return;
  }
  try {
    const place = await Place.findById(id);
    if (!place) {
      res.redirect('/weads/place/view-all');
      return;
    }

  let username = null
  createMessage = null
  if(req.query.createSuccess){
    createMessage = "Account created"
  }
  if(res.locals.user){
    username = res.locals.user.username
  }

  let role = null
  if(res.locals.user){
    role = res.locals.user.role
  }
  res.render('department/licenseRequest', {
    role,
    username,
    createMessage,
    licenseRequest: true,
    ward: place.ward,
    district: place.district
  });
  }
  catch (err) {
    console.log(err.message);
    res.redirect('/weads/place/view-all');
    return;
  }
});

Router.post('/create/:id', async (req, res) => {
  const id = req.params.id;
  const { adType, width, height, adName, adImages, companyName, companyPhone, companyEmail, startDate, endDate } = req.body;
  console.log(req.body);
  const adScale = width + "m x " + height + "m";

  if (!adType || !width || !height || !adName || !adImages || !companyName || !companyPhone || !companyEmail || !startDate || !endDate) {
    res.status(400).json({ success: false, error: "Missing information" });
    return;
  }
  if (!id) {
    res.status(400).json({ success: false, error: "Missing id" });
    return;
  }
  try {
    const place = await Place.findById(id);
    if (!place) {
      res.status(400).json({ success: false, error: "Place not found" });
      return;
    }

    const ads = await Ad.create({ adType, adScale, adName, adImages, companyName, companyPhone, companyEmail, startDate, endDate, licensed: false, place: place._id });
    res.status(201).json({ success: true });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false, error: err.message });
    return;
  }
});

module.exports = Router;