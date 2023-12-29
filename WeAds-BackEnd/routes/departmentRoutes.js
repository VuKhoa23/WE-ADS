const express = require('express');
const router = express.Router();
const Officer = require("../model/officer")

router.get('/department/create', (req, res) => {
  res.render("department/create-account", {
    username: res.locals.user.username,
    emailMessage: null,
    usernameMessage: null,
    body: null
  })
});

router.get("/create-account", async (req, res)=>{
  await Officer.create({
    username: "youngHT",
    password: "12345678",
    email: "huutam287@gmail.com",
    phone: "0932715653",
    role: "Department",
    district: "12",
    ward: "12",
  })
  res.send("OK")
})

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

module.exports = router