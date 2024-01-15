const express = require("express");
const router = express.Router();
const Officer = require('../model/officer');
const ObjectId = require('mongoose').Types.ObjectId;

router.get("/home", function (req, res, next) {
  let username = null
  createMessage = null
  if(req.query.createSuccess){
    createMessage = "Account created"
  }
  if(res.locals.user){
    username = res.locals.user.username
  }
  else {
    res.redirect('/weads/login');
    return;
  }

  let role = null
  if(res.locals.user){
    role = res.locals.user.role
  }
  res.render("department/index", {
    API_KEY: process.env.MAP_KEY,
    role: role,
    username: username,
    createMessage: createMessage,
    ward: res.locals.user ? res.locals.user.ward : null,
    district: res.locals.user ? res.locals.user.district : null
  });
});

router.get('/user/edit-profile', async (req, res) => {
  let officerId = null;
  if(res.locals.user){
    officerId = res.locals.user._id;
  }
  if (!officerId) {
    res.redirect('/weads/home');
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
  const user = await Officer.findOne({ _id: new ObjectId(officerId)});
  res.render('editProfile', {
    user,
    username,
    role
  })
});

router.get('/user/edit-profile', async (req, res) => {
  let officerId = null;
  if(res.locals.user){
    officerId = res.locals.user._id;
  }
  if (!officerId) {
    res.redirect('/weads/home');
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
  const user = await Officer.findOne({ _id: new ObjectId(officerId)});
  res.render('editProfile', {
    user,
    username,
    role
  })
});

router.post('/user/edit-profile', async (req, res) => {
  const { email, name, phone } = req.body;
  const user_name = req.body.username;
  let officerId = null;

  if(res.locals.user){
    officerId = res.locals.user._id;
  }
  if (!officerId) {
    res.status(404).json({ success: false, error: "officer id missing" });
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
  await Officer.updateOne({ _id: new ObjectId(officerId)}, {
    email,
    name, 
    phone,
    username: user_name
  });
  res.status(200).json({ success: true })
});

module.exports = router;
