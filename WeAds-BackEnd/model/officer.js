const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const officer = new Schema({
    username: {
        type: String,
        require: [true, 'Missing username']
    },
    password: {
        type: String,
        require: [true, 'Missing password']
    },
    name: {
        type: String,
        require: [true, 'Missing officer\'s name']
    },
    birthday: {
        type: Date,
        require: [true, 'Missing birthday']
    },
    email: {
        type: String,
        require: [true, 'Missing email']
    },
    phone: {
        type: String,
        require: [true, 'Missing phone number']
    }, 
    role: { 
        type: {type: String, enum: ['District', 'Ward']},
        require: [true, 'Missing office role']
    },
    resetCode: { // reset password code
        type: String
    }
})

const User = mongoose.model('officer', officer);

module.exports = User;