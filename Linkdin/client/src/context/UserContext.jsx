import { createContext, useContext, useEffect, useState } from "react"
import { authDataContext } from "./AuthContext"
import axios from "axios"

export const UserDataContext = createContext()

const UserContext = ({ children }) => {

    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    const { serverUrl } = useContext(authDataContext)

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(
                serverUrl + "/api/user/currentuser",
                { withCredentials: true }
            )

            setUserData(result.data)

        } catch (err) {
            console.log(err)
            setUserData(null)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [serverUrl])

    const value = {
        userData,
        setUserData,
        loading
    }

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContext