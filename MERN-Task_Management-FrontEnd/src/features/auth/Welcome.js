import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    const { username, isManager, isAdmin } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome back {username}!</h1>

            <p><Link to="/dash/notes">View Service Requests</Link></p>

            <p><Link to="/dash/notes/new">Add New Service Request</Link></p>

            {(isManager || isAdmin) && <p><Link to="/dash/users">View Users and Settings</Link></p>}

            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add a New User</Link></p>}

        </section>
    )

    return content
}
export default Welcome