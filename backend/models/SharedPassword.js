const mongoose = require('mongoose')

const sharedPasswordSchema = mongoose.Schema({
    id_owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    id_password: {
        type: mongoose.Types.ObjectId,
        ref: 'Password'
    },
    id_receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    status: {
        type: String,
        enum: ['valid','invalid'],
        default: 'valid'
    }
})

module.exports = mongoose.model('SharedPassword',sharedPasswordSchema)