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
    role: { 
        type: {type: String, enum: ['District', 'Ward']},
        require: true
    },
    resetCode: { // reset password code
        type: String
    }
})

const User = mongoose.model('officer', userSchema);

module.exports = User;