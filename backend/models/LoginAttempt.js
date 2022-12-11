const mongoose = require('mongoose')

const loginAttemptSchema = mongoose.Schema({
    correct: {
        type: Boolean,
        require: true
    },
    id_user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    computer: {
        type: String,
        default: ''
    },
    session: {
        type: String,
        default: ''
    },
    id_address: {
        type: mongoose.Types.ObjectId,
        ref: 'IPAddress'
    }
}, {timestamps: true})

module.exports = mongoose.model('LoginAttempt',loginAttemptSchema)