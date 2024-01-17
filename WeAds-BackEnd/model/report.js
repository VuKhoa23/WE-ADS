const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    ward: {
      type: String,
    },
    district: {
      type: String,
    },
    reportType: {
      type: String,
    },
    reportCode:{
      type: Number
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    content: {
      type: String,
    },
    // 0: chua xu li
    // 1: dang xu li
    // 2: xu li xong
    state: {
      type: String,
    },
    information: {
      type: String,
      default: null,
    },
    placeId: {
      type: String
    },
    adId:{
      type: String,
      default: null
    },
    ward: {
      type: String
    },
    district: {
      type: String
    }
  },
  { timestamps: true }
);

const Report = mongoose.model("report", reportSchema);

module.exports = Report;
