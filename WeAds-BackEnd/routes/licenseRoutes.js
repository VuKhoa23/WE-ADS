const express = require('express');
const Place = require("../model/places");
const Ad = require("../model/ads");
const Officer = require("../model/officer");
const { ObjectId } = require('mongodb');
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
  res.render('licenseRequest', {
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

  let officerId = null;
  if(res.locals.user){
    officerId = res.locals.user._id;
  }
  if (!officerId) {
    res.status(400).json({ success: false, error: "Missing officer id" });
    return;
  }

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
    const officer = await Officer.findById(officerId);
    if (!officer) {
      res.status(400).json({ success: false, error: "Officer not found" });
      return;
    }
    if (!place) {
      res.status(400).json({ success: false, error: "Place not found" });
      return;
    }

    const ads = await Ad.create({ adType, adScale, adName, adImages, companyName, companyPhone, companyEmail, startDate, endDate, licensed: false, place: place._id, createBy: officerId });
    res.status(201).json({ success: true });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false, error: err.message });
    return;
  }
});

Router.get('/view-all', async (req, res) => {
  try {
    const requests = await Ad.find({ licensed: false }).populate('place');
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
    res.render('department/viewLicenseReq', {
      requests,
      role,
      username,
      createMessage
    });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

Router.get('/view-all/created', async (req, res) => {
  let id = null;
  if(res.locals.user){
    id = res.locals.user._id;
  }
  if (!id) {
    res.redirect('/weads/home');
    return;
  }
  try {
    const requests = await Ad.find({ licensed: false, createBy: new ObjectId(id) }).populate('place');
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
    res.render('department/viewLicenseReq', {
      requests,
      role,
      username,
      createMessage
    });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

Router.get('/view/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).redirect('/weads/license-request/view-all');
    return;
  }
  try {
    const request = await Ad.findOne({ _id: new ObjectId(id) ,licensed: false }).populate('place');
    if (!request) {
      res.status(404).redirect('/weads/license-request/view-all');
      return;
    }

    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);

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
    res.render('department/licenseDetail', {
      request,
      startDate: `${startDate.getDate()}/${startDate.getMonth()+1}/${startDate.getFullYear()}`,
      endDate: `${endDate.getDate()}/${endDate.getMonth()+1}/${endDate.getFullYear()}`,
      role,
      username,
      createMessage
    });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

Router.post('/view/:id/accept', async function (req, res) {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ success: false, error: "Missing id" });
    return;
  }
  try {
    const request = await Ad.findOne({ _id: new ObjectId(id) ,licensed: false });
    if (!request) {
      res.status(400).json({ success: false, error: "Request not found" });
      return;
    }
    request.licensed = true;
    await request.save();
    res.status(200).json({ success: true });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

Router.post('/view/:id/decline', async function (req, res) {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ success: false, error: "Missing id" });
    return;
  }
  try {
    const request = await Ad.deleteOne({ _id: new ObjectId(id) ,licensed: false });
    res.status(200).json({ success: true });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

module.exports = Router;