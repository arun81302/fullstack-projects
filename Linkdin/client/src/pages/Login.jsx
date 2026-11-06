
import { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { UserDataContext } from '../context/userContext'

const Login = () => {
    const [show, setShow] = useState(false)
    let {serverUrl}=useContext(authDataContext)
    const navigate = useNavigate()
    
    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    let [loading,setLoading]=useState(false)
    let [err,setErr]=useState("")
    let {userData,setUserData}=useContext(UserDataContext)

    const handleSignin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr("")
    try {
        const result = await axios.post(
            serverUrl + "/api/auth/login",
            { email, password },
            { withCredentials: true }
        )
        setUserData(result.data)
        navigate("/")
    } catch (error) {
        setErr(error.response?.data?.message || "Server not reachable. Is the backend running?")
    } finally {
        setLoading(false)
    }
}

    function handleClick() {
        setShow(prev => !prev)
    }

    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center">

        
            <div className="p-4 sm:p-5 w-full flex items-center">
                <img
                    className="w-24 sm:w-28 h-auto"
                    src={logo}
                    alt="LinkedIn Logo"
                />
            </div>

            
            <div className="flex-1 w-full flex items-center justify-center px-4 py-6">

                <form onSubmit={handleSignin} className="w-[90%] max-w-[400px] min-h-[500px] sm:min-h-[550px] p-5 sm:p-7 md:shadow-xl rounded-xl flex flex-col justify-center gap-4">

                    <h1 className="font-semibold text-2xl sm:text-3xl">
                        Sign In
                    </h1>

                   
                    <input
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border rounded-lg outline-none focus:border-blue-500"
                    />

                    <div className="w-full flex items-center border rounded-lg focus-within:border-blue-500">

                        <input
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            type={show ? "text" : "password"}
                            placeholder="Password"
                            required
                            className="w-full min-w-0 p-2 outline-none rounded-lg"
                        />

                        <span
                            className="cursor-pointer text-blue-600 font-medium px-3 text-sm sm:text-base"
                            onClick={handleClick}
                        >
                            {show ? "Hide" : "Show"}
                        </span>
                    </div>
                    {err && <p className='text-center text-red-600 font-semibold'>*{err}</p>}

                    <button
                    
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition"
                        disabled={loading}

                    >
                       {loading?"Loading...":"Sign In"}
                    </button>

                    <p
                        className="text-center text-sm sm:text-base"
                        onClick={() => navigate("/signup")}
                    >
                        Create  an account?
                        <span className="text-blue-500 cursor-pointer ml-1">
                            Sign Up
                        </span>
                    </p>

                </form>
            </div>
        </div>
    )
}

export default Login

