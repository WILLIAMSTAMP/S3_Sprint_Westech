import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'

// This code exports a store object that represents your application's state tree and the logic to update that state tree. It is created using the configureStore function from the redux library.

// The configureStore function takes an object as an argument, with the following options:

// reducer: an object that maps keys (e.g. api, auth) to reducer functions. These reducer functions specify how the state tree should be updated in response to different actions.

// middleware: an array of middleware functions that are applied to the store's dispatch method. These functions can intercept actions as they are dispatched, allowing you to perform additional logic before the action is passed to the reducer.

// devTools: a boolean value that enables the Redux DevTools browser extension. This allows you to inspect the state tree, dispatch actions, and view the history of actions in your Redux store.

// In this case, the store object will have two reducers: apiSlice.reducer and authReducer. The apiSlice.reducer reducer is accessed using the apiSlice.reducerPath key, which is a dynamic way of accessing the reducer function. The authReducer reducer is accessed using the auth key.

// The store object will also have the apiSlice.middleware middleware function applied to it, in addition to the default middleware provided by the redux library.
// Finally, the store object will have the Redux DevTools enabled, allowing you to debug your application's state and actions.
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

setupListeners(store.dispatch)