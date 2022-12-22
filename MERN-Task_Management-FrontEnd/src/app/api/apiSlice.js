import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

// This code defines a constant called baseQuery using the fetchBaseQuery function, which appears to be a custom function. The baseQuery constant is assigned the value returned by the fetchBaseQuery function when it is called with an options object as an argument.
// The options object specifies the following properties:
// baseUrl: This is the base URL that will be used as the prefix for all requests made using the baseQuery constant. In this case, the base URL is 'http://localhost:3500'.
// credentials: This is a string that specifies whether or not to include credentials such as cookies in requests made using the baseQuery constant. The value of 'include' tells the browser to include credentials in the request.
// prepareHeaders: This is a function that is called before each request made using the baseQuery constant. It receives an instance of the Headers class and an object containing the current state of the application as arguments. 
// The function is expected to return the modified Headers instance. In this case, the function checks if there is an auth token in the application state and, if so, sets the authorization header to include the token as a Bearer token.
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

// This code defines a function called baseQueryWithReauth that appears to be a utility function for making HTTP requests using the baseQuery function defined earlier. The baseQueryWithReauth function takes three arguments: args, api, and extraOptions.
// args: This is an object or a string that specifies the request URL, method, and body for the HTTP request.
// api: This is an object that contains three properties: signal, dispatch, and getState(). It is not clear from this code snippet what these properties are used for.
// extraOptions: This is an optional object that can contain custom options for the HTTP request.
// The function first makes an HTTP request using the baseQuery function, and assigns the result to the result variable. If the result object contains an error property with a status of 403, this means that the request was forbidden. 
// In this case, the function sends a refresh token request to get a new access token. If the refresh request is successful, the function stores the new token and retries the original query using the new access token. If the refresh request is unsuccessful, the function returns the refresh request result. If the result object does not contain an error property with a status of 403, the function simply returns the result.
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})