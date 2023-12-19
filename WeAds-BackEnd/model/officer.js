const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

const User = mongoose.model('officer', officer);

module.exports = User;