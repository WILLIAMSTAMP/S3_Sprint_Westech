import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditNote from './features/notes/EditNote'
import NewNote from './features/notes/NewNote'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'


// The App function appears to be the root component of an application that uses the Routes and Route components from the react-router-dom library to define a routing system. The routing system consists of both public and protected routes.
// The App function contains a Routes component as the root element. Within the Routes component, there is a Route component with the path attribute set to '/' and the element attribute set to the Layout component. This Route component serves as the root of the routing system and defines the layout of the application.
// Inside the root Route component, there are several other Route components that define public and protected routes. The public routes include the index route (/), which displays the Public component, and the login route, which displays the Login component.
// The protected routes are defined within a Route component with the element attribute set to the PersistLogin component, which appears to handle the persistence of the login state. Within the PersistLogin component, there is a Route component with the element attribute set to the RequireAuth component, which appears to handle the authentication of the user.
// Inside the RequireAuth component, there is a Route component with the element attribute set to the Prefetch component, which appears to handle the prefetching of data. Inside the Prefetch component, there is a Route component with the path attribute set to 'dash' and the element attribute set to the DashLayout component, which serves as the layout for the dashboard.
// The DashLayout component contains several other Route components that define the routes for the dashboard, including routes for managing users and notes. Some of these routes are protected by the RequireAuth component, which only allows users with the Manager or Admin role to access them.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;