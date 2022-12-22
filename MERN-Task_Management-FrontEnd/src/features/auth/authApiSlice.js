import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

// The authApiSlice constant is an object created using the injectEndpoints method from the apiSlice object. The injectEndpoints method is likely a method from a custom library or utility that is used to manage API requests in a Redux-like way.
// The authApiSlice object has an endpoints property, which is an object that defines a login endpoint using the mutation method from the builder object. The mutation method appears to be a method that creates an object with a query property, which is a function that returns an object with the details of an HTTP POST request. The request is made to the '/auth' URL with the credentials object passed as the body of the request.
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        // The sendLogout function appears to be a function that sends a request to log the user out of the application. It is likely defined using the mutation method from the builder object, which is likely a method from a custom library or utility that is used to manage API requests in a Redux-like way.
        // The mutation method creates an object with a query property, which is a function that returns an object with the details of an HTTP POST request. The request is made to the '/auth/logout' URL with no body.
        // The sendLogout function could be imported and used in other parts of the application to send a logout request to the server. 
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // The onQueryStarted function takes two arguments: arg and an object with the dispatch and queryFulfilled properties. The dispatch property is likely a reference to the Redux dispatch function, which is used to dispatch an action to the store. The queryFulfilled property is likely a reference to a Promise that resolves when the request is complete.
            // Inside the onQueryStarted function, a try block is used to send the request and handle the response. If the request is successful, the data property from the response is logged to the console and the logOut action is dispatched to the store. If an error occurs, the error is logged to the console.
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    setTimeout(() =>  {
                    dispatch(apiSlice.util.resetApiState())
        }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            // The onQueryStarted function takes two arguments: arg and an object with the dispatch and queryFulfilled properties. The dispatch property is likely a reference to the Redux dispatch function, which is used to dispatch an action to the store. The queryFulfilled property is likely a reference to a Promise that resolves when the request is complete.
            // Inside the onQueryStarted function, a try block is used to send the request and handle the response. If the request is successful, the data property from the response is destructured and the accessToken property is extracted. The setCredentials action is then dispatched to the store with the accessToken as an argument. If an error occurs, the error is logged to the console.
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 