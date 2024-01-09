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

Router.post('/test-post', function(req, res){
  console.log(req.body);
  res.json({ ok: true});
});

module.exports = Router;