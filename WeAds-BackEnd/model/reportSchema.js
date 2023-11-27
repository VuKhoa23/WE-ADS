const mongoose = require('mongoose'); 

const reportSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Plank reporter name']
    },
    address: {
      type: String,
      required: [true, 'Missing address information']
    },
    reportType: {
      type: String,
      required: [true, 'Unkouwn reason to report']
    },
    email: {
      type: String,
      required: [true, 'Reporter email is missing']
    },
    phone: {
      type: String,
      required: [true, 'Reporter phone numer is missing']
    },
    content: {
      type: String,
      required: [true, 'Plank report content']
    },
    state: {
      type: Boolean,
      required: true
    },
    information: {
      type: String
    },
  },
  {timestamps: true}
)

const Report = mongoose.model('report', reportSchema);

module.exports = Report;