const multer = require("multer");
const fs = require("fs");
const path = require("path");


const storageAds = multer.memoryStorage()
const uploadAds = multer({ storage: storageAds });

module.exports = {uploadAds};