const express = require("express");
const router = express.Router();
const UpdateRequest = require("../model/updateRequest");
const Ad = require("../model/ads");
const Place = require("../model/places");
const Officer = require("../model/officer");
const { ObjectId } = require('mongodb');
const sendMailController = require('../controller/sendEmail');

// router.get("/:placeId", async function (req, res, next) {
//   const placeRes = await fetch("https://weads-backend.vercel.app/weads/place/details/" + req.params.placeId)
//   const placeResult = await placeRes.json()
//   const coordinates = placeResult.place.coordinates

//   res.render("update-form", {
//     role: res.locals.user.role,
//     username: res.locals.user.username,
//     coordinates: coordinates,
//     API_KEY: process.env.MAP_KEY,
//   })
// });

// router.get("/:index/:adIndex", function (req, res, next) {
//   res.send(req.params.index + "-" + req.params.adIndex)
// });

router.get('/view-all', async (req, res) => {
  const type = req.query.type;
  try {
    let requests = undefined;
    if (type == 'place') {
      requests = await UpdateRequest.find({ state: 0, updateFor: 'Place'});
    }
    else {
      requests = await UpdateRequest.find({ state: 0, updateFor: 'Ad'});
    }
    let username = null

    if(res.locals.user){
      username = res.locals.user.username
    }

    let role = null
    if(res.locals.user){
      role = res.locals.user.role
    }
    if (role != 'Department') {
      res.redirect('/weads/update-request/view-all/created?' + new URLSearchParams(req.query).toString());
      return;
    }
    res.render('department/viewUpdateReq', {
      requests,
      type,
      role,
      username,
    });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

router.get('/view-all/created', async (req, res) => {
  let id = null;
  const type = req.query.type;
  if (!type) {
    res.redirect('/weads/update-request/view-all/created?type=place');
    return;
  }
  if(res.locals.user){
    id = res.locals.user._id;
  }
  if (!id) {
    res.redirect('/weads/home');
    return;
  }
  try {
    let requests = undefined;
    if (type == 'place') {
      requests = await UpdateRequest.find({ updateFor: 'Place', createBy: new ObjectId(id)});
    }
    else {
      requests = await UpdateRequest.find({ updateFor: 'Ad', createBy: new ObjectId(id)});
    }
    let username = null

    if(res.locals.user){
      username = res.locals.user.username
    }

    let role = null
    if(res.locals.user){
      role = res.locals.user.role
    }
    res.render('department/viewUpdateReq', {
      requests,
      type,
      role,
      username,
    });
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

router.get('/view/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).redirect('/weads/update-request/view-all');
    return;
  }
  try {
    const request = await UpdateRequest.findOne({ _id: new ObjectId(id) });
    const ad = await Ad.findOne({ _id: request.targetId });
    const place = await Place.findOne({ _id: request.targetId });
    if (!request) {
      res.status(404).redirect('/weads/update-request/view-all');
      return;
    }

    let username = null
    
    if(res.locals.user){
      username = res.locals.user.username
    }
    
    let role = null
    if(res.locals.user){
      role = res.locals.user.role
    }

    const createDate = new Date(request.createdAt);

    if (request.updateFor == 'Ad') {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const oldStartDate = new Date(ad.startDate);
      const oldEndDate = new Date(ad.endDate);
      res.render('department/updateDetail', {
        request,
        type: request.updateFor,
        oldData: ad,
        startDate: `${startDate.getDate()}/${startDate.getMonth()+1}/${startDate.getFullYear()}`,
        endDate: `${endDate.getDate()}/${endDate.getMonth()+1}/${endDate.getFullYear()}`,
        oldStartDate: `${oldStartDate.getDate()}/${oldStartDate.getMonth()+1}/${oldStartDate.getFullYear()}`,
        oldEndDate: `${oldEndDate.getDate()}/${oldEndDate.getMonth()+1}/${oldEndDate.getFullYear()}`,
        createDate: `${createDate.getDate()}/${createDate.getMonth()+1}/${createDate.getFullYear()}`,
        role,
        username,
      });
    }
    else {
      res.render('department/updateDetail', {
        request,
        type: request.updateFor,
        oldData: place,
        createDate: `${createDate.getDate()}/${createDate.getMonth()+1}/${createDate.getFullYear()}`,
        role,
        username,
      });
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

router.post('/view/:id/accept', async function (req, res, next) {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ success: false, error: "Missing id" });
    return;
  }
  try {
    const request = await UpdateRequest.findOne({ _id: new ObjectId(id) }).populate('createBy');
    if (!request) {
      res.status(400).json({ success: false, error: "Request not found" });
      return;
    }
    if (request.updateFor == 'Ad') {
      await Ad.findOneAndUpdate({ _id: new ObjectId(request.targetId) }, {
        adType: request.adType,
        adScale: request.adScale,
        adName: request.adName,
        adImages: request.adImages,
        companyName: request.companyName,
        companyPhone: request.companyPhone,
        companyEmail: request.companyEmail,
        startDate: request.startDate,
        endDate: request.endDate,
      });
      request.state = '1';
      await request.save();
      req.receiver = request.createBy.email;
      req.name = request.createBy.username;
      req.state = 'được phê duyệt';
      req.address = request.ward + ', ' + request.district;
      req.type = 'biển quảng cáo'
      next();
    }
    else {
      await Place.updateOne({_id: new ObjectId(request.targetId) }, { adType: request.adType, locationType: request.locationType, adPlanned: request.adPlanned });
      request.state = '1';
      await request.save();
      req.receiver = request.createBy.email;
      req.name = request.createBy.username;
      req.state = 'được phê duyệt';
      req.address = request.ward + ', ' + request.district;
      req.type = 'điểm quảng cáo'
      next();
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
}, sendMailController.sendUpdateAnnounce);

router.post('/view/:id/decline', async function (req, res, next) {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ success: false, error: "Missing id" });
    return;
  }
  try {
    await UpdateRequest.updateOne({ _id: new ObjectId(id) }, { state: '2' });
    const request = await UpdateRequest.findOne({ _id: new ObjectId(id) }).populate('createBy');
    if (request.updateFor == 'Ad') {
      req.receiver = request.createBy.email;
      req.name = request.createBy.username;
      req.state = 'bị từ chối';
      req.address = request.ward + ', ' + request.district;
      req.type = 'biển quảng cáo'
      next();
    }
    else {
      req.receiver = request.createBy.email;
      req.name = request.createBy.username;
      req.state = 'bị từ chối';
      req.address = request.ward + ', ' + request.district;
      req.type = 'điểm quảng cáo'
      next();
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
}, sendMailController.sendUpdateAnnounce);

module.exports = router;
