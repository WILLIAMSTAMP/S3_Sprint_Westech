const Note = require('../models/Note')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// Get all notes 
// route: GET /notes
// access: Private
// The function begins by using the Note.find() method to retrieve all notes from the database. The find() method is likely a static method on a model object that represents a note in the database. 
// It returns a query object that can be used to retrieve documents that match a specific criteria (in this case, no criteria, so all documents are returned). The .lean() method is called on the returned query object to convert the documents to plain JavaScript objects, which can be modified more easily. 
// The .exec() method is called on the returned query object to execute the query and return a promise that resolves with the result.
const getAllNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})

// Create new note
// route: POST /notes
// access: Private
// This function creates a new note and stores it in a database or other data store. It uses an async handler to catch any errors that may occur during the execution of the function.
// The function begins by destructuring the user, title, and text fields from the request body. It then checks whether these fields are present using the !field condition (where field is one of the destructured variables). 
// If any of the fields are not present, the function will return a response with a status code of 400 (Bad Request) and a JSON object containing a message.
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    // The .lean() method is called on the returned query object to convert the document to a plain JavaScript object, which can be modified more easily. 
    // The .exec() method is called on the returned query object to execute the query and return the promise.
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    // Create and store the new note
    const note = await Note.create({ user, title, text })

    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})

// Update a note
// route: PATCH /notes
// access: Private
// This function that updates an existing note in a database or other data store. It uses an async handler to catch any errors that may occur during the execution of the function.
// The function begins by destructuring the id, user, title, text, and completed fields from the request body. It then checks whether these fields are present and of the correct data type using the !field and typeof field !== 'boolean' conditions (where field is one of the destructured variables). 
// If any of the fields are not present or are of the wrong data type, the function will return a response with a status code of 400 (Bad Request) and a JSON object containing a message.
// The function then uses the Note.findById() method to retrieve the note that is being updated. The findById() method is likely a static method on a model object that represents a note in the database. 
// It takes in an _id value and returns a query object that can be used to retrieve the document with the corresponding _id. The .exec() method is called on the returned query object to execute the query and return the promise.
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()

    // Allow renaming of the original note 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)
})

// Delete a note
// route DELETE /notes
// access Private
// This function deletes an existing note from a database or other data store. It uses an async handler to catch any errors that may occur during the execution of the function.
// The function begins by destructuring the id field from the request body. It then checks whether the id field is present using the !id condition. If the id field is not present, the function will return a response with a status code of 400 (Bad Request) and a JSON object containing a message.
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}