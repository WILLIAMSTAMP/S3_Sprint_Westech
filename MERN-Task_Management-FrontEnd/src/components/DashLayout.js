import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

// DashLayout is a functional component in React that renders the layout for the dashboard. It returns a React fragment that includes the DashHeader, DashFooter, and an element with the "dash-container" class that contains the Outlet component from the @reach/router library.

// The Outlet component is a placeholder that is used to render the contents of the current route within the dashboard. It allows the dashboard to display different content depending on the current pathname and route configuration.
const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className="dash-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}
export default DashLayout