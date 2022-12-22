const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
// This function retrieves all users from a MongoDB database using the User.find() method, which part of the MongoDB driver. It then uses the select method to exclude the password field from the retrieved documents, and the lean method to convert the MongoDB documents to plain JavaScript objects.
// If no users are found, it returns a response with a status code of 400 and a JSON body containing a message. Otherwise, it returns a response with the retrieved users as the JSON body.
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
// destructures the username, password, and roles fields from the request body. It then checks if any of these values are missing or if the roles field is not an array with at least one element. If any of these conditions are true, it returns a response with a status code of 400 and a JSON body containing an error message.
// Next, it checks for a duplicate username by using the User.findOne() method and the lean and exec methods to search for a user with the given username. If a duplicate is found, it returns a response with a status code of 409 and a JSON body containing an error message.
// If no duplicate is found, it hashes the password using the bcrypt.hash() function and then creates a new user object by combining the username, hashedPwd, and roles values. It then uses the User.create() method to create a new user document in the database with the user object.
// If the user was successfully created, it returns a response with a status code of 201 and a JSON body containing a message. Otherwise, it returns a response with a status code of 400 and a JSON body containing an error message.
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
// The updateUser function destructures the id, username, roles, active, and password fields from the request body. It then checks if any of the id, username, roles, or active fields are missing or if the roles field is not an array with at least one element, or if the active field is not a boolean. If any of these conditions are true, it returns a response with a status code of 400 and a JSON body containing an error message.
// Next, it uses the User.findById() method and the exec method to retrieve the user document with the given id. If the user is not found, it returns a response with a status code of 400 and a JSON body containing an error message.
// It then checks for a duplicate username by using the User.findOne() method and the lean and exec methods to search for a user with the given username. If a duplicate is found, it checks if the duplicate user has the same id as the original user. 
// If the duplicate has a different id, it returns a response with a status code of 409 and a JSON body containing an error message.
// If no duplicate is found, or if the duplicate has the same id as the original user, it updates the original user object with the new username, roles, and active values. If the password field was included in the request body, it also hashes the new password and updates the original user object with the hashed password.
// Finally, it uses the save() method to update the user document in the database with the modified user object, and returns a response with a JSON body containing a message indicating that the user was updated.
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
//  This function deletes a user from a MongoDB database. It uses the asyncHandler utility function to wrap the main function, which is then called with the req and res arguments.
// Inside the function, it destructures the id field from the request body. It then checks if the id field is missing, and if it is, it returns a response with a status code of 400 and a JSON body containing an error message.
// Next, it uses the Note.findOne() method and the lean and exec methods to check if the user has any assigned notes by searching for a note document with a user field that matches the given id. If a note is found, it returns a response with a status code of 400 and a JSON body containing an error message.
// It then uses the User.findById() method and the exec method to retrieve the user document with the given id. If the user is not found, it returns a response with a status code of 400 and a JSON body containing an error message.
// If the user is found, it uses the deleteOne() method to delete the user document from the database. It then constructs a response message indicating that the user was deleted and returns it as the JSON body of the response.
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}