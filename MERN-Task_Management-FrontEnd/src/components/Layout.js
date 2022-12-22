import { Outlet } from 'react-router-dom'

// The Layout function appears to be a functional component in React that renders the layout for the application. It returns the Outlet component from the @reach/router library, which is a placeholder that is used to render the contents of the current route.
const Layout = () => {
    return <Outlet />
}
export default Layout