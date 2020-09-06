const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 18) {
                throw new Error('Age must be +18');
            }
        }
    }});


userSchema.pre('save', function(next){
    const user = this;

    return bcrypt.hash(user.password, 8)
        .then(function(hash){
            user.password = hash;
            next();
        })
});



const User = mongoose.model('User', userSchema);

module.exports = User;