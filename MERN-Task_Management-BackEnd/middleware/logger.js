const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
// This is a pair of middleware functions for an Express.js server. The first function, logEvents, is an async function that logs a message to a file with a given filename. It generates a unique identifier (UUID) and a timestamp, and then writes the message to the file along with the UUID and timestamp. It uses the fs and fsPromises modules to handle the file system operations, and the path and uuid modules to generate the UUID and construct the file path, respectively.
// The second function, logger, is a middleware function that logs the request method, URL, and origin to a file and logs the request method and path to the console. It uses the logEvents function to log the request information to a file, and then calls the next function to pass control to the next middleware function in the chain.
// These middleware functions can be used to log incoming requests and any errors that occur during request processing, allowing the server to keep track of its activity and diagnose any issues that may arise.
const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEvents, logger }