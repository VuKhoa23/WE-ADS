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
    res.redirect('/weads/home')
  } catch (err) {
    console.log(err)
    res.send("Error")
  }
})

// router.get('/create', async (req, res) => {
//   await Officer.create({
//     username: "vukhoa23",
//     password: "anhkhoa0123",
//     name: "Vu Anh Khoa",
//     email: "vuanhkhoa007@gmail.com",
//     phone: "123456789",
//     role: "Department",
//   })
//   res.send("CREATED")
// });

module.exports = router;