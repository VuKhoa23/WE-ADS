const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adFormat = new Schema ({
    name: {
        type: String,
    },
})

const AdFormat = mongoose.model('adFormat', adFormat);

module.exports = AdFormat;