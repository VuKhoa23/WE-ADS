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
  place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "place",
  }
})

const Ad = mongoose.model('ad', ad);

module.exports = Ad;