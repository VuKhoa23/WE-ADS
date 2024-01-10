const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Place = require("../model/places")

const ad = new Schema({
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
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "officer",
  },
  licensed: {
    type: Boolean
  },
  place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "place",
  }
})

const Ad = mongoose.model('ad', ad);

module.exports = Ad;