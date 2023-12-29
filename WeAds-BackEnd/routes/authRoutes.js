const express = require('express');
const router = express.Router();
const Officer = require("../model/officer")
const jwt = require('jsonwebtoken')

router.get('/logout', (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/weads/home");
});

const maxAge = 3 * 24 * 60 * 60;

const createToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: maxAge,
  });
};

router.post("/process-login", async (req, res)=>{
  const { email, password } = req.body;
  try {
    const officer = await Officer.login(email, password);
    const token = createToken(officer._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.send("OK")
  } catch (err) {
    if(err.message === "incorrect password"){
      res.send("Wrong password")
      return
    }else{
      res.send("Email not exists")
      return
    }
  }
})


module.exports = router;