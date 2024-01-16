const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();

const userRoutes = require("./routes/userRoutes");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const MAP_KEY = process.env.MAP_KEY;

app.listen(process.env.PORT);
console.log("listening on port: " + process.env.PORT);

app.get("/", (req, res) => {
  res.redirect("/weads/home");
});
app.use("/weads", userRoutes);
