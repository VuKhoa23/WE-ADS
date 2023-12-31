const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const place = new Schema({
    type: {
      type: String,
      default: "Feature",
    },
    coordinates: [{
      type: Number
    }],
    ward:{
      type: String
    },
    district:{
      type: String
    },
    adPlanned:{
      type: Number
    }
})

const Place = mongoose.model('place', place);

module.exports = Place;