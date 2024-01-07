const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ward = new Schema ({
    name: {
        type: String,
    },

    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "district",
    },

})

const Ward = mongoose.model('ward', ward);

module.exports = Ward;