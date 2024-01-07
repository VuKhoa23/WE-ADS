const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const district = new Schema ({
    name: {
        type: String,
    },
})

const District = mongoose.model('district', district);

module.exports = District;