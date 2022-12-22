require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500
// The code starts by requiring a few modules, including the dotenv module, which is used to load environment variables from a .env file, the express module, which is used to create the server, and the path module, which is used to manipulate file paths. 
// It also requires a few custom modules, including logger, errorHandler, cookieParser, and cors, which are middleware functions that will be used to modify the request and response objects. It also requires the corsOptions object, 
// which is used to configure the cors middleware function. It also requires the connectDB function, which is used to connect to the MongoDB database. It also requires the mongoose module, which is used to create a connection to the MongoDB database. It also requires the PORT constant, which is used to set the port number that the server will listen on.

console.log(process.env.NODE_ENV)

// The code then establishes a connection to a MongoDB database using the connectDB function and starts a listener for the open event on the database connection. 
// When the connection is opened, the server starts listening for incoming requests on the specified port (PORT). If the connection fails, the error is logged to the console.
connectDB()

// The server uses several middleware functions to process requests and responses:

// logger: This is a middleware function that logs information about each incoming request to the console.

// cors(corsOptions): This is a middleware function that enables Cross-Origin Resource Sharing (CORS) for the server. It allows the server to accept requests from web pages that are served from different domains. The corsOptions object is passed as an argument to the cors function and specifies options for CORS behavior.

// express.json(): This is a built-in middleware function in Express that parses incoming requests with JSON payloads and makes the contents available in the request.body property of the request object.

// cookieParser(): This is a middleware function that parses the cookie header in incoming requests and populates the request.cookies object with the cookies sent by the client.

// express.static: This is a built-in middleware function in Express that serves static files from a given directory. In this case, the public directory is being used to serve static files.

// app.use('/', require('./routes/root')): This sets up a middleware function that routes requests with a path of '/' to the root route, which is defined in the ./routes/root module.

// app.use('/auth', require('./routes/authRoutes')): This sets up a middleware function that routes requests with a path of '/auth' to the authRoutes module, which is defined in the ./routes/authRoutes module.

// app.use('/users', require('./routes/userRoutes')): This sets up a middleware function that routes requests with a path of '/users' to the userRoutes module, which is defined in the ./routes/userRoutes module.

// app.use('/notes', require('./routes/noteRoutes')): This sets up a middleware function that routes requests with a path of '/notes' to the noteRoutes module, which is defined in the ./routes/noteRoutes module.

// app.all('*', (req, res) => {...}): This sets up a middleware function that handles all requests with a path that does not match any of the routes set up previously. It sends a 404 response with an HTML, JSON, or plain text message depending on the client's accept header.

// app.use(errorHandler): This is a middleware function that handles errors that are thrown by any of the middleware functions or route handlers preceding it.

// mongoose.connection.once('open', () => {...}): This sets up a listener for the 'open' event on the MongoDB connection, which is emitted when the connection to the MongoDB server is established. When the event is emitted, the server starts listening for incoming requests on the specified port.

// Finally The mongoose.connection.on('error', err => {...}) line of code sets up a listener for the 'error' event on the MongoDB connection, which is emitted when an error occurs while using the connection. When the event is emitted, the error is logged to the console using console.log and to a file using the logEvents function. The logEvents function appears to be a custom function that logs events to a file.
app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
