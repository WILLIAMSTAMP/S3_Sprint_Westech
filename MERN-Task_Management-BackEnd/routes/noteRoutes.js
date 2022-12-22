const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')
const verifyJWT = require('../middleware/verifyJWT')

// The router.use() function is used to apply middleware to the router and the verifyJWT middleware is being applied to all routes defined after it.
// The router.route() function is used to create a new route for the / path. This route will handle GET, POST, PATCH, and DELETE requests.
// For GET requests, the getAllNotes function from the notesController object will be called. For POST requests, the createNewNote function from the notesController object will be called. For PATCH requests, the updateNote function from the notesController object will be called. And for DELETE requests, the deleteNote function from the notesController object will be called.
// It's important to note that these routes will only be activated when a request is made to the server with the corresponding path and HTTP method. For example, a GET request to the / path will trigger the route to handle the request and call the getAllNotes function. A POST request to the / path will trigger the route to handle the request and call the createNewNote function.
router.use(verifyJWT)

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router