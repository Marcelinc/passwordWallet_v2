const mongoose = require('mongoose')

const IPAddressSchema = mongoose.Schema({
    okLoginNum: {
        type: Number,
        default: 0
    },
    badLoginNum: {
        type: Number,
        default: 0
    },
    lastBadLoginNum: {
        type: Number,
        default: 0
    },
    permanentLock: {
        type: Boolean,
        default: false
    },
    tempLock: {
        type: Date,
        default: Date.now()-1000
    },
    addressIP: {
        type: String,
        require: true,
        default: ''
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    }
})

module.exports = mongoose.model('IPAddress',IPAddressSchema)