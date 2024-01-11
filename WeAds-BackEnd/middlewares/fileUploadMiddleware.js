const jwt = require("jsonwebtoken");
const Officer = require("../model/officer")
var fs = require('fs');
const path = require('path');

const checkDirectory = function (req, res, next) {
  const dir = path.resolve(path.join(__dirname, '../public/adImages'));
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
  next();
};

module.exports = {checkDirectory};