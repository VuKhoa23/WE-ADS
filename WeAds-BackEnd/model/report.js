const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    // 0: báo cáo điểm đặt
    // 1: báo cáo điểm quảng cáo
    // 2: báo cáo một điểm bất kì trên map
    reportType: {
      type: String,
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
    state: {
      type: Boolean,
    },
    information: {
      type: String,
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
