const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportType = new Schema ({
    name: {
        type: String,
    },
})

const ReportType = mongoose.model('reportType', reportType);

module.exports = ReportType;