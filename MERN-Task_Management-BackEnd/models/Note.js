const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
// This code is used define a Mongoose schema for a "note" document. A Mongoose schema defines the structure and constraints for a document in a MongoDB collection.

// The schema includes the following fields:
// user: An object ID field that references a user document and is required.
// title: A string field that is required.
// text: A string field that is required.
// completed: A boolean field with a default value of false.
// The schema also includes a timestamps option that adds createdAt and updatedAt fields to the document, which are automatically set to the current date and time when the document is created or updated.

// The schema also includes a plugin that uses the AutoIncrement module to automatically increment a field called ticket for each new note document, starting at 500. The ticketNums field is used to store the current value of the ticket field.
// This schema can be used to define a Mongoose model for interacting with a MongoDB collection of notes. The model can then be used to create, read, update, and delete (CRUD) note documents in the collection.
const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Note', noteSchema)