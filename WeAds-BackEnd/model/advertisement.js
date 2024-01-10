const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertisement = new Schema ({
    name: {
        type: String,
    },
})

const Advertisement = mongoose.model('advertisement', advertisement);

module.exports = Advertisement;