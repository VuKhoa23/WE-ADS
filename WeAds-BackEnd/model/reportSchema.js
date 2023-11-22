const mongoose = require('mongoose'); 

const reportSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Plank reporter name']
    },
    reportType: {
      type: String,
      required: true
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
  },
  {timestamps: true}
)

const Report = mongoose.model('report', reportSchema);

module.exports = Report;