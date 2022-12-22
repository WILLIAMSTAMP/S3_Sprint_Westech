import { useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

import useAuth from '../hooks/useAuth'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

// The DashHeader is a functional component in React that renders a header for a dashboard. It uses the useAuth hook to determine the user's role (isManager and isAdmin) and the useNavigate and useLocation hooks from the @reach/router library to handle navigation and determine the current pathname.
// The component also uses the useSendLogoutMutation hook, which appears to be a custom hook that sends a request to log the user out. The hook returns an array with a function to trigger the logout request (sendLogout) and an object with information about the request's loading state (isLoading), 
// success state (isSuccess), error state (isError), and any error that may have occurred (error).
// The component uses the useEffect hook to trigger a side effect when the isSuccess state changes. If the logout request was successful, the component uses the navigate function to navigate the user back to the root path ('/').
const DashHeader = () => {
    const { isManager, isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

// The onNewNoteClicked, onNewUserClicked, onNotesClicked, and onUsersClicked functions are event handlers that use the navigate function from the @reach/router library to navigate to different paths within the dashboard when called.
// onNewNoteClicked navigates the user to the path for creating a new note, onNewUserClicked navigates the user to the path for creating a new user, onNotesClicked navigates the user to the path for viewing a list of notes, 
// and onUsersClicked navigates the user to the path for viewing a list of users. 
    const onNewNoteClicked = () => navigate('/dash/notes/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNotesClicked = () => navigate('/dash/notes')
    const onUsersClicked = () => navigate('/dash/users')

    // The dashClass variable appears to be used to store a class name that determines the size of the dashboard header. The value of the dashClass variable is determined based on the current pathname, which is obtained using the useLocation hook from the @reach/router library.
    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }
// This defines a variable called newNoteButton and assigns it a value of null. It then checks if the current pathname, obtained using the useLocation hook from the @reach/router library, matches the pattern defined in the NOTES_REGEX regular expression. 
// If the pathname does match the pattern, the newNoteButton variable is reassigned to a button element that, when clicked, calls the onNewNoteClicked event handler. 
    let newNoteButton = null
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <button
                className="icon-button"
                title="New Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }
// This code defines a variable called newUserButton and assigns it a value of null. It then checks if the current pathname, obtained using the useLocation hook from the @reach/router library, matches the pattern defined in the USERS_REGEX regular expression. 
// If the pathname does match the pattern, the newUserButton variable is reassigned to a button element that, when clicked, calls the onNewUserClicked event handler. The event handler uses the navigate function from the @reach/router library to navigate the user to the path for creating a new user. 
    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }
    // This code defines a variable called userButton and assigns it a value of null. It then checks if the authenticated user is a manager or an admin, using the isManager and isAdmin variables obtained from the useAuth hook. 
    // If the user is a manager or an admin, the code checks if the current pathname, obtained using the useLocation hook from the @reach/router library, matches the pattern defined in the USERS_REGEX regular expression and includes the string "/dash". 
    // If the pathname does not match the pattern and includes the string "/dash", the userButton variable is reassigned to a button element that, when clicked, calls the onUsersClicked event handler. 
    let userButton = null
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }
// This code defines a variable called notesButton and assigns it a value of null. It then checks if the current pathname, obtained using the useLocation hook from the @reach/router library, matches the pattern defined in the NOTES_REGEX regular expression and includes the string "/dash". 
// If the pathname does not match the pattern and includes the string "/dash", the notesButton variable is reassigned to a button element that, when clicked, calls the onNotesClicked event handler. The event handler uses the navigate function from the @reach/router library to navigate the user to the path for viewing a list of notes. 
    let notesButton = null
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <button
                className="icon-button"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }
// The logoutButton variable is a button element that, when clicked, calls the sendLogout function. The sendLogout function is part of the array returned by the useSendLogoutMutation hook, which appears to be a custom hook that sends a request to log the user out. 
    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const errClass = isError ? "errmsg" : "offscreen"

// This allows the dashboard header to display a loading message while the logout request is being processed, and to display the buttons for navigating between different sections of the dashboard and for logging out once the logout request is complete or has failed.
    let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>
    } else {
        buttonContent = (
            <>
                {newNoteButton}
                {newUserButton}
                {notesButton}
                {userButton}
                {logoutButton}
            </>
        )
    }
// The content variable is a React fragment that contains the elements that are rendered in the dashboard header. It includes a paragraph element that displays an error message if one occurred while attempting to log out, 
// and a header element with a navigation bar that displays the buttons for navigating between different sections of the dashboard and for logging out.
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">WESTech Electronics - Dashboard</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default DashHeader