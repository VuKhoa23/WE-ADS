const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const officer = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    }, 
    role: { 
        type: String
    },
    resetCode: { // reset password code
        type: String
    },
    changePassword: {
        type: Boolean
    },
    district:{
        type: String
    },
    ward: {
        type: String
    }
})

officer.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

officer.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const Officer = mongoose.model('officer', officer);

module.exports = Officer;