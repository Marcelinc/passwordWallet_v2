const mongoose = require('mongoose')

const IncorrectLoginSchema = mongoose.Schema({
    sessionId: {
        type: String,
        require: true
    },
    id_address: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    computer: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('IncorrectLogin',IncorrectLoginSchema)