import { createContext } from "react"

export const authDataContext=createContext()

const AuthContext = ({children}) => {
const serverUrl="https://fullstack-projects-1-wvxi.onrender.com" 
    let value={
        serverUrl
    }

  return (
    <div>
        <authDataContext.Provider value={value}>
         {children}
         </authDataContext.Provider>
    </div>
   
  )
}

export default AuthContext
