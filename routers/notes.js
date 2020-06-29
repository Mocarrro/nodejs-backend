const express = require('express')
const router = express.Router()
const Note = require('../models/note')

const cors = require('cors')

router.use(cors())

router.get('/', async (req, res) => {
    try {
        const notes = await Note.find()
        res.json(notes)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.post('/', async (req, res) => {
    const delayValue = req.body.noteDelay;
    const noteValue = transformText(req.body.noteText)
    console.log(noteValue)
    const note = new Note({
        noteText: noteValue,
        noteDelay: delayValue,
        timestamp: req.body.timestamp
    })
    try {
        if (!delayValue) {
            res.status(400).json({ message: 'Delay is required' });
        }
        else {
            const newNote = await note.save();
            setTimeout(() => {
                sendResponse(res, newNote);
            }, delayValue);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router

async function sendResponse(response, note) {

    const notes = await Note.find().sort({ timestamp: 'asc' });
    response.status(201).json(notes);
}

function transformText(text){

    text = text.toUpperCase();
    text = text.replace(/ /g,"_"); 

    return text;
}