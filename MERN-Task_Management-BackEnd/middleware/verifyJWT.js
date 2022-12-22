const jwt = require('jsonwebtoken')

// This is an authentication middleware function for an Express.js server that verifies a JSON Web Token (JWT) passed in the Authorization header of the request. It uses the jwt npm package to decode and verify the token.
// The function first checks if the Authorization header is present and begins with the string 'Bearer '. If the header is missing or invalid, it returns a response with a status code of 401 (unauthorized).
// If the header is present and valid, it extracts the token from the header and verifies it using the jwt.verify() function. The function takes the token, a secret key (stored in the ACCESS_TOKEN_SECRET environment variable), and a callback function as arguments. 
// If the token is successfully verified, the callback function decodes the token and adds the username and roles fields from the token's payload to the req object. 
// It then calls the next() function to pass control to the next middleware function in the chain. If the token is not valid, the function returns a response with a status code of 403 (forbidden).
// This authentication middleware function can be used to protect routes or resources by requiring a valid JWT to be included in the Authorization header of the request.
// It can be used in conjunction with other middleware functions or route handlers to enforce access controls based on the user's identity and permissions.
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles
            next()
        }
    )
}

module.exports = verifyJWT 