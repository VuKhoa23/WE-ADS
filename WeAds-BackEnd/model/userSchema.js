const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String
    },
    googleID: {
        type: String
    },
    birthday: {
        type: Date
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }, 
    resetCode: {
        type: String
    }
})

const User = mongoose.model('user', userSchema);

module.exports = User;