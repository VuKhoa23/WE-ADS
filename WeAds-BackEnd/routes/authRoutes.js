const express = require('express');
const router = express.Router();
const Officer = require("../model/officer")
const Report = require('../model/report');
const resetPasswordController = require('../controller/resetPassword');
const sendMailController = require('../controller/sendEmail');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
require("dotenv").config();

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
    if (err.message == "incorrect password" || err.message == "incorrect email") {
      res.cookie("loginErr", "Email hoặc mật khẩu không chính xác", { maxAge: 60 * 60 * 1000 });
      res.redirect("/weads/login");
      return;
    }
    console.log(err)
    res.send("Error")
  }
})

router.get('/forget-password', async (req, res) => {
  const sendCodeErr = req.cookies.sendCodeErr;
  if (!sendCodeErr) 
    res.render("forget_password/sendCode", {
      error: ""
    });
  else {
    res.cookie("sendCodeErr", "", { maxAge: 1 });
    res.render("forget_password/sendCode", {
      error: sendCodeErr
    });
  }
});

router.post('/forget-password', resetPasswordController.preprocess, sendMailController.sendCode);

router.get('/forget-password/verify', async (req, res) => {
  const verifyCodeErr = req.cookies.verifyCodeErr;
  let resetEmail = req.cookies.resetEmail;
  if (!resetEmail)
    resetEmail = "";
  if (!verifyCodeErr) 
    res.render("forget_password/verifyCode", {
      error: "",
      expireTime: process.env.EMAIL_EXPIRE_TIME,
      email: resetEmail
    });
  else {
    res.cookie("verifyCodeErr", "", { maxAge: 1 });
    res.render("forget_password/verifyCode", {
      error: verifyCodeErr,
      expireTime: process.env.EMAIL_EXPIRE_TIME,
      email: resetEmail
    });
  }
});

router.post('/forget-password/verify', resetPasswordController.verifyCode);

router.get("/forget-password/:id/change-password", async (req, res) => {
  const id = req.params;
  try {
    const user = await Officer.findOne({ _id: new ObjectId(id) });
    if (!user) {
      res.redirect('/weads/forget-password');
      return;
    }
    let error = req.cookies.changePasswordErr;
    res.cookie("changePasswordErr", "", { maxAge: 1 });
    if (!error)
      error = "";
    res.render("forget_password/changePassword", {
      error: error
    });
  }
  catch (err) {
    console.log(err);
    res.redirect('/weads/home');
  }
});

router.post("/forget-password/:id/change-password", async (req, res) => {
  const id = req.params;
  const { email, newPassword } = req.body;
  res.cookie("resetEmail", "", { maxAge: 1 });
  if (!email || !newPassword) {
    res.cookie("changePasswordErr", "Vui lòng thử lại", { maxAge: 60 * 60 * 1000 });
    res.redirect(`/weads/forget-password/${id}/change-password`);
    return;
  }
  try {
    const user = await Officer.findOne({ _id: new ObjectId(id) });
    if (!user) {
      res.cookie("sendCodeErr", "Không tìm thấy tài khoản liên kết với email này", { maxAge: 60 * 60 * 1000 });
      res.redirect('/weads/forget-password');
      return;
    }
    if (!user.changePassword) {
      res.cookie("sendCodeErr", "Vui lòng thử lại", { maxAge: 60 * 60 * 1000 });
      res.redirect('/weads/forget-password');
      return;
    }
    if (user.email != email) {
      res.cookie("changePasswordErr", "Vui lòng nhập email đã liên kết với tài khoản này", { maxAge: 60 * 60 * 1000 });
      res.redirect(`/weads/forget-password/${id.id}/change-password`);
      return;
    }
    user.changePassword = false;
    user.password = newPassword;
    await user.save();
    res.render('forget_password/success');
  }
  catch (err) {
    console.log(err);
    res.redirect('/weads/home');
  }
});

router.post('/send-result', async (req, res, next) => {
  try {
    const { reportId, reportSolution } = req.body;
    console.log(reportSolution, reportId);
    if (!reportSolution || !reportId) {
      res.status(400).json({ success: false, error: 'Missing information1' });
      return;
    }
    const report = await Report.findOne({ _id: new ObjectId(reportId) });
    if (!report) {
      res.status(400).json({ success: false, error: 'Report not found' });
      return;
    }
    report.state = true;
    report.information = reportSolution;
    await report.save();
    req.receiver = report.email;
    req.name = report.name;
    req.address = report.address;
    req.result = reportSolution;
    next();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message});
  }
} ,sendMailController.sendReportResult);

module.exports = router;