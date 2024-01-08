const mongoose = require('mongoose'); 

const updateReqSchema = mongoose.Schema({
    address: {
      type: String,
      required: [true, 'Update information needed']
    },
    content: {
      type: String
    },
    placeIndex:{
      type: Number
    },
    adIndex:{
      type: Number,
      default: null
    },
    state: {
      type: Number,
      default: 0
    }
  },
  {timestamps: true}
)

const updateRequest = mongoose.model('updateRequest', updateReqSchema);

module.exports = updateRequest;