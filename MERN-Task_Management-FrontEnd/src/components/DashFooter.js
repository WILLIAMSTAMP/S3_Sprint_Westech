import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from "../hooks/useAuth"

// The DashFooter function is a functional component in React that renders a footer for a dashboard. It uses the useNavigate and useLocation hooks from the @reach/router library to handle navigation and determine the current pathname. It also uses the useAuth hook to get the username and status of the authenticated user.
// The component renders a button that takes the user back to the dashboard home page when clicked, but only if the current pathname is not already the dashboard home page. The button uses the FontAwesomeIcon component from the react-fontawesome library to display a house icon.
const DashFooter = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const { username, status } = useAuth()

    const onGoHomeClicked = () => navigate('/dash')

    let goHomeButton = null
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="dash-footer">
            {goHomeButton}
            <p>Current User: { username }</p>
            <p>Status: { status }</p>
        </footer>
    )
    return content
}
export default DashFooter