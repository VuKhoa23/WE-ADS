const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    district:{
      type: String
    },
    ward:{
      type: String
    },
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
  },
  { timestamps: true }
);

const Report = mongoose.model("report", reportSchema);

module.exports = Report;
