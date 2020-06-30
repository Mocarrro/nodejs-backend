const express = require('express')
const router = express.Router()
const Note = require('../models/note')

const cors = require('cors')
const note = require('../models/note')

router.use(cors())

router.get('/', async (request, response) => {
    try {
        const notes = await Note.find();
        response.json(notes);
    } catch (error) {
        response.status(500).json({
            message: error.message
        })
    }
});

router.delete('/delete', async (request, response) => {
    try {
        await Note.deleteMany({});
        const notes = await Note.find({});
        response.json(notes);
    } catch (error) {
        response.status(500).json({
            message: error.message
        })
    }
});

router.post('/', async (request, response) => {
    const delayValue = request.body.noteDelay;
    const noteValue = transformText(request.body.noteText);
    const note = new Note({
        noteText: noteValue,
        noteDelay: delayValue,
        timestamp: request.body.timestamp
    });

    try {
        if (!delayValue) {
            response.status(400).json({ message: 'Delay is required' });
        } else {
            await note.save();

            setTimeout(async () => {
                const givenNote = await Note.findOne({ _id: note.id });

                if (!!givenNote && !givenNote.canceled) {
                    note.handled = true;
                    await note.save();

                    const allValidNotes = await Note
                        .find({ canceled: false, handled: true })
                        .sort({ timestamp: 'asc' });

                    response.status(201).json(allValidNotes);
                } else {
                    response.status(200).json(null);
                }
            }, delayValue);
        }
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});

router.post('/cancel', async (request, response) => {
    const allCancelableNotes = await Note
        .find({ canceled: false, handled: false });

    allCancelableNotes.forEach(async (note) => {
        note.canceled = true;
        await note.save();
    });

    response.status(200).json(null);
});

function transformText(text) {
    text = text.toUpperCase();
    text = text.replace(/ /g, "_");

    return text;
}

module.exports = router;
