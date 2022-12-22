import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
// The useAuth function appears to be a custom Hook that retrieves the current authentication state from the Redux store and returns an object with the current user's information.
// The function uses the useSelector Hook from the react-redux library to retrieve the token from the store using the selectCurrentToken selector. If the token is not null, the function decodes the token using the jwtDecode function from the jwt-decode library. The decoded object contains information about the user, such as the username and roles.
// The function then sets the isManager and isAdmin variables based on whether the roles array includes the 'Manager' and 'Admin' roles, respectively. It also sets the status variable based on the user's role.
// The function returns an object with the username, roles, status, isManager, and isAdmin properties. If the token is null, the function returns an object with default values for these properties.
// The useAuth function could be used in other parts of the application to access the current user's information and determine their role. 
const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"

        return { username, roles, status, isManager, isAdmin }
    }

    return { username: '', roles: [], isManager, isAdmin, status }
}
export default useAuth