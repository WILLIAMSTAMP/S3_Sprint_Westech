const express = require('express')
const router = express.Router()
const path = require('path')
// This is a route that is using the Express.js framework to handle GET requests to the / or /index paths. The route uses a regular expression to match the requested path.
// The route uses the res.sendFile() function to send the index.html file as the response to the client. The file is located in the views directory, which is a sibling of the directory where this code file is located. The path.join() function is used to construct the full path to the file.
// It's important to note that this route will only be activated when a GET request is made to the server with a path matching the regular expression. For example, a GET request to the / path or a GET request to the /index path will trigger the route to handle the request and send the index.html file as the response.
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router