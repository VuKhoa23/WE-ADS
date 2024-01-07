const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const district = new Schema ({
    sid: {
        type: Number,
    },
    
    name: {
        type: String,
    },
})

const District = mongoose.model('district', district);

module.exports = District;