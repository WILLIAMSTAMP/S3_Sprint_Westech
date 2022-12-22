const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')
// This is a rate-limiting middleware function for an Express.js server, using the rate-limit npm package. The rateLimit function takes an options object that specifies the rate-limiting behavior.
// In this case, the options object specifies that the rate limit is applied to login requests, with a window size of 1 minute (60 seconds) and a maximum of 5 requests allowed per IP address per window. 
// It also includes a custom message to be returned to the client when the rate limit is exceeded, and a custom handler function to be called when the rate limit is exceeded. The handler function logs the error message to a file using the logEvents function and sends the custom message to the client with a status code of 429 (too many requests).
// The options object also specifies that the rate limit information should be included in the RateLimit-* headers of the response, and that the legacy X-RateLimit-* headers should be disabled.
// This rate-limiting middleware function can be used to prevent brute-force login attacks by limiting the number of login attempts that can be made within a given time window.
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` per minute
    message:
        { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter