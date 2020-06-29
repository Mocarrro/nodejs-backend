const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    noteText: {
        type: String,
        required: true
    },
    noteDelay: {
        type: Number
    }
})

module.exports = mongoose.model('Note', noteSchema)