const express = require('express');
const Ad = require("../model/ads");
const LicenseRequest = require("../model/licenseRequest");
const Officer = require("../model/officer");
const AdTypes = require("../model/advertisement");
const { ObjectId } = require('mongodb');
const Router = express.Router();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const {
uploadAds
} = require("../middlewares/fileUploadMiddleware");

const bucket_name = process.env.BUCKET_NAME
const bucket_region = process.env.BUCKET_REGION
const access_key = process.env.ACCESS_KEY
const secret_access_key = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials:{
    accessKeyId: access_key,
    secretAccessKey: secret_access_key
  },
  region: bucket_region
})

Router.get('/create/:id', async (req, res) => {
  const id = req.params.id;
  const adTypes = await AdTypes.find({});
  if (!id) {
    res.redirect('/weads/place/view-all');
    return;
  }
  try {
    const ad = await Ad.findById(id).populate('place');
    if (!ad) {
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
    adTypes,
    username,
    createMessage,
    licenseRequest: true,
    adId: ad._id,
    ward: ad.place.ward,
    district: ad.place.district
  });
  }
  catch (err) {
    console.log(err.message);
    res.redirect('/weads/place/view-all');
    return;
  }
});

Router.post('/create/:id', uploadAds.fields([
  {
    name: "theAdImages",
    maxCount: 5,
  },
]) ,async (req, res) => {
  const id = req.params.id;
  const { adType, width, height, adName, companyName, companyPhone, companyEmail, startDate, endDate } = req.body;
  const adScale = width + "m x " + height + "m";
  const data = req.files;
  const images = Object.values(data)[0]
  let adImages = []
  if (images) {
    for(let image of images){
      const fileName = Date.now() + image.originalname.replace(/ /g, "")
      adImages.push("https://weads.s3.ap-southeast-2.amazonaws.com/" + fileName)
      const params = {
        Bucket: bucket_name,
        Key: fileName,
        Body: image.buffer,
        ContentType: image.mimetype
      }
      const command = new PutObjectCommand(params)
      await s3.send(command)
    }
  }

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
    const ad = await Ad.findById(id).populate('place');
    const officer = await Officer.findById(officerId);
    if (!officer) {
      res.status(400).json({ success: false, error: "Officer not found" });
      return;
    }
    if (!ad) {
      res.status(400).json({ success: false, error: "ads not found" });
      return;
    }

    await LicenseRequest.create({ adId: ad._id ,adType, adScale, adName, adImages, companyName, companyPhone, companyEmail, startDate, endDate, place: ad.place._id, createBy: officerId, state: '0' });
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
    const requests = await LicenseRequest.find({ state: '0'}).populate('place');
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
    if (role != 'Department') {
      res.redirect('/weads/license-request/view-all/created');
      return;
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
    const requests = await LicenseRequest.find({ createBy: new ObjectId(id) }).populate('place');
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
    const request = await LicenseRequest.findOne({ _id: new ObjectId(id) }).populate('place');
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
    const request = await LicenseRequest.findOne({ _id: new ObjectId(id) });
    if (!request) {
      res.status(400).json({ success: false, error: "Request not found" });
      return;
    }
    const ad = await Ad.findOneAndUpdate({ _id: new ObjectId(request.adId) }, {
      adType: request.adType,
      adScale: request.adScale,
      adName: request.adName,
      adImages: request.adImages,
      companyName: request.companyName,
      companyPhone: request.companyPhone,
      companyEmail: request.companyEmail,
      startDate: request.startDate,
      endDate: request.endDate,
      place: request.place,
      licensed: true
    });
    await LicenseRequest.updateMany({adId: new ObjectId(request.adId)}, {
      state: '2'
    });
    request.state = '1';
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
    await LicenseRequest.updateOne({ _id: new ObjectId(id) }, { state: '2' });
    res.status(200).json({ success: true });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

Router.post('/view/:id/delete', async function (req, res) {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ success: false, error: "Missing id" });
    return;
  }
  try {
    await LicenseRequest.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

module.exports = Router;