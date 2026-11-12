import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { useContext } from "react"
import { UserDataContext } from "./context/userContext"
import Profile from "./pages/Profile";
import Network from "./pages/Network";

const App = () => {

    const { userData, loading } = useContext(UserDataContext)

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <Routes>
            <Route
                path="/"
                element={userData ? <Home /> : <Navigate to="/login" />}
            />

            <Route path="/signup" element={<Signup />} />

            <Route
                path="/login"
                element={userData ? <Navigate to="/" /> : <Login />}
            />
            <Route path="/profile/:userId" element={<Profile />} />
<Route path="/network" element={<Network />} />
        </Routes>
    )
}

export default App