const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Place = require("../model/places");
const Ads = require("../model/ads");

const licenseRequest = new Schema({
  adType: {
    type: String
  },
  adScale: {
    type: String
  },
  adName: {
    type: String
  },
  adImages:[{
    type: String
  }],
  companyName: {
    type: String
  },
  companyPhone: {
    type: String
  },
  companyEmail: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ad", 
  },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "officer",
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "place",
  },
  state: {//0: waiting, 1: accepted, 2: declined
    type: String
  }
})

const LicenseRequest = mongoose.model('licenseRequest', licenseRequest);

module.exports = LicenseRequest;