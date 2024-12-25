const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    country: String,
    visitTime: {
        type: Date,
        default: Date.now
    },
    userAgent: String,
    path: String
});

module.exports = mongoose.model('Visitor', visitorSchema);
