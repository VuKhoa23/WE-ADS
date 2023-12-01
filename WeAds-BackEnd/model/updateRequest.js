const mongoose = require('mongoose'); 

const updateReqSchema = mongoose.Schema({
    address: {
      type: String,
      required: [true, 'Update information needed']
    },
    location: {
      type: String,
      required: [true, 'Update information needed']
    },
    locationType: {
      type: String,
      required: [true, 'Update information needed']
    },
    adsType: {
      type: String,
      required: [true, 'Update information needed']
    },
    images: {
      type: String
    },
    organized: {
      type: Boolean,
      require: true
    },
    processed: {
      type: Boolean,
      require: true
    },
    reason: {
      type: String,
      require: [true, 'Update information needed']
    },
  },
  {timestamps: true}
)

const updateRequest = mongoose.model('updateRequest', updateReqSchema);

module.exports = updateRequest;