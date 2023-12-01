const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    birthday: {
        type: Date,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    }, 
    resetCode: { // reset password code
        type: String
    }
})

const User = mongoose.model('departmentOfficer', userSchema);

module.exports = User;