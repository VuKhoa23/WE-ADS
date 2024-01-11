const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    // <option value="0">Tố giác sai phạm</option>
    // <option value="1">Đăng ký nội dung</option>
    // <option value="2">Đóng góp ý kiến</option>
    // <option value="3">Giải đáp thắc mắc</option>
    reportType: {
      type: String,
    },
    // 0: báo cáo điểm đặt
    // 1: báo cáo điểm quảng cáo
    // 2: báo cáo một điểm bất kì trên map
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
