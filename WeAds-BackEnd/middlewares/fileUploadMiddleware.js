const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Item = require("../models/item");

const checkDirectory = function (req, res, next) {
  const dir = path.resolve(path.join(__dirname, '../public/adImages'));
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
  next();
};

const storageAds = multer.diskStorage({
  destination: (req, file, cb) => {
    checkExist("public/images/items-images");
    cb(null, "public/images/items-images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname.replace(/ /g, ""));
  },
});

const uploadAds = multer({ storage: storageAds });

module.exports = {checkDirectory, uploadAds};