const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

// This route will handle GET, POST, PATCH, and DELETE requests of the userControllers.
// For GET requests, the getAllUsers function from the usersController object will be called. For POST requests, the createNewUser function from the usersController object will be called. For PATCH requests, the updateUser function from the usersController object will be called. And for DELETE requests, the deleteUser function from the usersController object will be called.
// router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router
