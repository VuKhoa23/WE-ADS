const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const passport = require('passport')
var bodyParser = require('body-parser')
require("dotenv").config();
const cors = require("cors");
const {
  checkUser,
} = require("./middlewares/authMiddleware");

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express()

const googleAuth = require("./controller/googleAuth")
const authRoutes = require("./routes/authRoutes")

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize()); 
app.use(cookieParser())


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/googleRedirect"
},
function(accessToken, refreshToken, profile, done) {
    //console.log(accessToken, refreshToken, profile)
    return done(null, profile)
}
))

passport.serializeUser(function(user, done) {
  done(null, user)
})
passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));


app.get("*", checkUser);
app.post("*", checkUser);

app.get('/googleRedirect', passport.authenticate('google'), googleAuth.createToken)

app.use(cors());

const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reportApi = require("./api/reportApi");


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const MAP_KEY = process.env.MAP_KEY;

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT);
console.log("listening on port: " + process.env.PORT);

app.get("/", (req, res) => {
  res.redirect("/weads/home");
});

app.use("/weads", userRoutes);
app.use("/weads", departmentRoutes);
app.use("/weads", authRoutes)
app.use("/weads/report", reportRoutes); 
app.use("/api/weads-admin/report", reportApi);
app.use('/weads/login', (req, res) => {
  res.render("login", {
    username: res.locals.user ? res.locals.user.username : null
  });
});
app.get("/weads/current", (req, res)=>{
  if(res.locals.user === null){
    res.send("Not logged in")
  }
  else{
    console.log(res.locals.user)
    res.send(res.locals.user)
  }
})


