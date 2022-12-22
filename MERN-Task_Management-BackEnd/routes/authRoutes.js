const { Router } = require('express')
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')
// The router.route() function is used to create a new route. The .post() and .get() functions are used to specify the HTTP method that the route will handle (POST and GET, respectively).
// The first route is for the / path and will handle POST requests. It looks like it is using a loginLimiter middleware function and calling the login function from an authController object when a request is received.
// The second route is for the /refresh path and will handle GET requests. It calls the refresh function from the authController object when a request is received.
// The third route is for the /logout path and will handle POST requests. It calls the logout function from the authController object when a request is received.
// It's important to note that these routes will only be activated when a request is made to the server with the corresponding path and HTTP method. For example, a POST request to the / path will trigger the first route, while a GET request to the /refresh path will trigger the second route.
router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router
