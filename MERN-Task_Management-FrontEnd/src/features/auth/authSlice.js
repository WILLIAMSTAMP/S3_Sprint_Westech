import { createSlice } from '@reduxjs/toolkit'
// The code defines a Redux slice for managing the authentication state of the application. A slice is a slice of state in a Redux store that represents a specific domain or feature of the application.

// The authSlice is created using the createSlice method from the redux-starter-kit library. It has three properties: name, initialState, and reducers.
// The name property is a string that specifies the name of the slice.
// The initialState property is an object that defines the initial state of the slice. In this case, the initial state has a token property set to null.
// The reducers property is an object that defines the reducers for the slice. Reducers are functions that specify how the state of the slice should be updated in response to an action. In this case, there are two reducers: setCredentials and logOut.
// The setCredentials reducer updates the token property of the state with the accessToken from the payload of the action. The logOut reducer sets the token property to null.
// The slice also exports two action creators: setCredentials and logOut. Action creators are functions that return actions, which are objects that describe the intent to change the state of the application.
const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.token = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token