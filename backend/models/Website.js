const mongoose = require('mongoose');

const websiteSchema = mongoose.Schema({
    name: {
        type: String,
        req: true
    },
    ownName: {
        type:String,
        default: ''
    },
    colors: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Website', websiteSchema);