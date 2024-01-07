const express = require('express');
const router = express.Router();
const Officer = require("../model/officer")
const District = require("../model/district")
const Ward = require("../model/ward") 

router.get('/department/create', (req, res) => {
  res.render("department/create-account", {
    username: res.locals.user.username,
    emailMessage: null,
    usernameMessage: null,
    body: null
  })
});

router.post('/department/create', async (req, res) => {
  let emailMessage = null;
  const tempOfficerEmail = await Officer.findOne({email: req.body.email})
  if(tempOfficerEmail){
    emailMessage = "This email already exists"
  }

  let usernameMessage = null;
  const tempOfficerUsername = await Officer.findOne({username: req.body.username})
  if(tempOfficerUsername){
    usernameMessage = "This username already exists"
  }

  if(usernameMessage === null && emailMessage === null){
    const officer = await Officer.create(req.body)
    console.log(req.body.role)
    res.redirect("/weads/home?createSuccess=true")
    return
  }

  res.render("department/create-account", {
    emailMessage: emailMessage,
    usernameMessage: usernameMessage,
    body: req.body,
    username: res.locals.user.username,
  })
})

router.get("/create-account", async (req, res)=>{
  await Officer.create({
    username: "youngHT",
    password: "12345678",
    email: "hohuutam287@gmail.com",
    phone: "0932715653",
    role: "Department",
    district: "12",
    ward: "12",
  })
  res.send("OK")
})

router.get('/department/places/allDistrict', async function (req, res) {
  const districts = await District.find({});

  res.render("department/district", {
    districts: districts,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,

  })
})

router.get('/department/places/allWard/:_id', async function(req, res) {
    try {
        const districtId = req.params._id;

        const district = await District.findOne({_id: districtId});

        const wards = await Ward.find({district: districtId});

        res.render("department/ward", {
          wards: wards,
          district: district.name,
          username: res.locals.user ? res.locals.user.username : null,
          role: res.locals.user ? res.locals.user.role : null,
        });

    } catch (error) {
      console.error('Error fetching ward:', error);
      res.status(500).send('Internal Server Error');
    }
});

module.exports = router