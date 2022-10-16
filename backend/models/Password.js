const mongoose = require('mongoose')

const passwordSchema = mongoose.Schema({
    password: {
        type: String,
        require: [true, 'Give password']
    },
    id_user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    web_address: {
        type: String,
        require: true
    },
    description: {
        type: String,
        default: ''
    },
    login: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Password',passwordSchema)