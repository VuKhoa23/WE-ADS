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
    if (err.message == "incorrect password") {
      res.cookie("loginErr", "Email hoặc mật khẩu không chính xác", { maxAge: 60 * 60 * 1000 });
      res.redirect("/weads/login");
      return;
    }
    console.log(err)
    res.send("Error")
  }
})

// router.get('/create', async (req, res) => {
//   await Officer.create({
//     username: "admin_phat",
//     password: "123456",
//     name: "Nguyen Thuan Phat",
//     email: "nguyenthuanphat301212@gmail.com",
//     phone: "0123456789",
//     role: "Department",
//   })
//   res.send("CREATED")
// });

router.get('/forget-password', async (req, res) => {
  res.render('forget_password/sendCode');
});

router.get('/forget-password/verify', async (req, res) => {
  res.render('forget_password/verifyCode');
});

module.exports = router;