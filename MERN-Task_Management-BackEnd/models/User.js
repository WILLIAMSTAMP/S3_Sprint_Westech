const mongoose = require('mongoose')
// This code defines a Mongoose schema for a "user" document. A Mongoose schema defines the structure and constraints for a document in a MongoDB collection.

// The schema includes the following fields:

// username: A string field that is required.
// password: A string field that is required.
// roles: An array of string fields with a default value of "Employee".
// active: A boolean field with a default value of true.
// This schema can be used to define a Mongoose model for interacting with a MongoDB collection of users. The model can then be used to create, read, update, and delete (CRUD) user documents in the collection. The username and password fields can be used for authentication purposes, and the roles field can be used to assign different levels of access or permissions to different users. The active field can be used to enable or disable a user's access to the system.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)