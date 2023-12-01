const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const userRoutes = require("./routes/userRoutes");

const reportApi = require("./api/reportApi");

const reportRoutes = require("./routes/reportRoutes");
app.use('/report', reportRoutes);//test api report

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const MAP_KEY = process.env.MAP_KEY;

mongoose
  .connect(process.env.MONGO_PHAT)
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
app.use('/api/weads-admin/report', reportApi);


//testing code
const passRoutes = require('./routes/passwordRoutes');

app.use('/test/password/', passRoutes);
//----------------------------------------------------------------