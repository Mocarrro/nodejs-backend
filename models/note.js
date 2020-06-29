const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    noteText: {
        type: String,
        required: true
    },
    noteDelay: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    handled: {
        type: Boolean,
        default: false
    },
    canceled: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Note', noteSchema)