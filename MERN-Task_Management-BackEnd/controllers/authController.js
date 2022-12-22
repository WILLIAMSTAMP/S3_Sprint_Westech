const User = require('../models/User')

const bcrypt = require('bcrypt')
// A library to help you hash passwords. 
// https://www.npmjs.com/package/bcrypt

const jwt = require('jsonwebtoken')
// JSON Web Tokens (JWT) have been introduced as a method of secure communication between two parties.
// Although it was meant for any secure communication, JWT is mainly associated with authentication and authorization.
const asyncHandler = require('express-async-handler')



// Login
// route: POST /auth
// access: Public
// Checks if the username and password fields are present in the request body. If either of them are not present, it will return a response with a status code of 400 and a JSON object containing a message.
// This code does not actually perform the login process. It only checks that the required fields are present and returns a response if they are not. 
// The User.findOne() method is likely a static method on a model object that represents a user in a database or other data store. It is used to find a single user that matches a specific criteria (in this case, a specific username). 
// The .exec() method is called on the returned query object to execute the query and return a promise that resolves with the result.
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }


//  foundUser utilizes the mongoDB findOne() method to find and return one document that matches the given selection criteria ({username}).
// The code is attempting to find a user with the provided username in a database or other data store. If a user with that username is not found, or if the foundUser object has an active property that is falsy, 
// it will return a response with a status code of 401 (Unauthorized) and a JSON object containing a message.
    const foundUser = await User.findOne({ username }).exec()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
        // If username is Not found response status is (401) and message Unauthorized 
    }


    // match utilizes the bcrypt.compare() method to check the document queried previously with the foundUser function. The method compares the plain text password provided by the user with the encrypted password stored in DB.
    // If the password and the hashed password do not match (as determined by the !match condition), the code will return a response with a status code of 401 (Unauthorized) and a JSON object containing a message.
    const match = await bcrypt.compare(password, foundUser.password)
    // If password is Not found response status is (401) and message Unauthorized 
    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    


    // The following functions will generate the Access and Refresh Tokens using the “user” info.
    // This code is using the jwt library to create a JSON Web Token (JWT). A JWT is a digital token that is used to authenticate a user and transmit information between parties. 
    // It consists of a header, a payload, and a signature, and is typically used to authenticate requests made to an API.
    // In this case, the code is using the jwt.sign() method to create a new JWT with a payload containing information about the user (their username and roles). The sign() method takes in three arguments: the payload, a secret used to sign the token, and an options object. 
    // The options object can contain various properties, such as the expiresIn property, which specifies the  time after which the token will expire.
    // The sign() method returns the signed JWT, which can then be stored in a cookie or sent back to the client in a response header or body. The client can then use the JWT to authenticate subsequent requests to the API by including the token in the request header.
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    // This code is similar to the previous code, but it is creating a different type of JSON Web Token (JWT) called a refresh token. A refresh token is a JWT that is used to obtain a new access token after the original access token has expired.
    // Refresh tokens allow users to remain authenticated even if their access token has expired, without requiring them to enter their credentials again. This is convenient for users and can improve the user experience, but it also introduces additional security considerations.
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Creates a secure cookie with the refresh token 
    // This code is setting a cookie on the server's response object using the res.cookie() method. A cookie is a small piece of data that is stored on the client's computer and sent back to the server with each request. 
    // Cookies are often used to store information about a user's session, such as their authentication status or preferences.
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
})



// Refresh
// route: GET /auth/refresh
// access: Public - when access token has expired
// This code is a function that handles a refresh token request. It first checks whether a jwt cookie is present in the request using the req.cookies property. If the jwt cookie is not present, it returns a response with a status code of 401 (Unauthorized) and a JSON object containing a message.
// If the jwt cookie is present, it stores the cookie value in a variable called refreshToken. It then uses the jwt.verify() method to verify the authenticity of the refreshToken. The verify() method takes in three arguments: the token to be verified, the secret used to sign the token, and a callback function. 
// If the refreshToken is invalid or has been tampered with, the err  argument of the callback function will contain an error object. If the refreshToken is valid, the decoded argument of the callback function will contain the decoded payload of the token.
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

//  Logout
// route: POST /auth/logout
// access: Public - clear cookie if exists
// This function handles a logout request. It first checks whether a jwt cookie is present in the request using the req.cookies property. If the jwt cookie is not present, it returns a response with a status code of 204 (No Content). This indicates that the request was successful, but there is no content to send back to the client.
// If the jwt cookie is present, the code uses the res.clearCookie() method to delete the jwt cookie from the client's computer. The clearCookie() method takes in two arguments: the name of the cookie to be deleted and an options object. 
// In this case, the options object includes the httpOnly, sameSite, and secure options, which have the same meanings as described in the previous answer.
// After the cookie has been deleted, the code returns a response with a JSON object containing a message indicating that the cookie has been cleared.
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}