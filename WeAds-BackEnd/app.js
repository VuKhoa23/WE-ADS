const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());

const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");

const reportApi = require("./api/reportApi");


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

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
app.use("/weads/report", reportRoutes); 
app.use("/api/weads-admin/report", reportApi);

//test code-------------------------------------------------------------
app.use('/test-ui', (req, res) => {
  res.render("test", {
    role: 'Department'
  });
});
