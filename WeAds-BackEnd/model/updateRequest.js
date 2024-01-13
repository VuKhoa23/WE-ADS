const mongoose = require('mongoose'); 

const updateReqSchema = mongoose.Schema({
    updateFor : {
      type: String
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "officer",
    },
    state: {
      type: Number
    },
    locationType: [{
      type: String
    }],
    adType: {
      type: String
    },
    adPlanned:{
      type: Number
    },
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
    }
  },
  {timestamps: true}
)

const updateRequest = mongoose.model('updateRequest', updateReqSchema);

module.exports = updateRequest;