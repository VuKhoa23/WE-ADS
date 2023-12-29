const express = require("express");
const router = express.Router();

router.get("/home", function (req, res, next) {
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
  res.render("department/index", {
    API_KEY: process.env.MAP_KEY,
    role: role,
    username: username,
    createMessage: createMessage
  });
});

module.exports = router;
