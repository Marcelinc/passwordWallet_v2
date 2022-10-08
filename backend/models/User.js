const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    login: {
        type: String,
        required: [true, 'Please add login'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add password']
    },
    salt: {
        type: String,
        default: ''
    },
    isPasswordKeptAsHmac: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model('User',userSchema)