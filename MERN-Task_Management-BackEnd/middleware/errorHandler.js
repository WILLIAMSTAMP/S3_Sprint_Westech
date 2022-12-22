const { logEvents } = require('./logger')

// This is an error handling middleware function for an Express.js server. It takes four arguments: err, req, res, and next. The err argument is an error object, the req and res arguments are objects representing the incoming request and the outgoing response, respectively, and the next argument is a function that passes control to the next middleware function in the chain.
// Inside the function, it logs the error information to a file using the logEvents function and logs the error stack trace to the console. It then gets the current status code of the response, or sets it to 500 (server error) if it is not already set. It then sets the status code of the response and sends a JSON response with the error message as the body.
// This error handling middleware function can be used to catch and handle any errors that occur in the preceding middleware functions or route handlers, allowing the server to gracefully handle errors and provide meaningful feedback to the client.
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 // server error 

    res.status(status)

    res.json({ message: err.message })
}

module.exports = errorHandler 