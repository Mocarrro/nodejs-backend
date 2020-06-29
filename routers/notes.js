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
    const delayValue = req.body.noteDelay
    const note = new Note({
        noteText: req.body.noteText,
        noteDelay: delayValue
    })
    try {
        if (delayValue == null) {
            res.status(400).json({ message: 'Delay is required' })
        }
        else {
            const newNote = await note.save()
            setTimeout(() => {
                res.status(201).json(newNote)
            },
                delayValue);
        }

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
