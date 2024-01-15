const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationType = new Schema ({
    name: {
        type: String,
    },
})

const LocationType = mongoose.model('locationType', locationType);

module.exports = LocationType;