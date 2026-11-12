import { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { UserDataContext } from "../context/userContext";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

const Login = () => {
    const [show, setShow] = useState(false);

    const { serverUrl } = useContext(authDataContext);
    const { setUserData } = useContext(UserDataContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // Login API call
    const handleSignin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErr("");

        try {
            const result = await axios.post(
                serverUrl + "/api/auth/login",
                { email, password },
                { withCredentials: true }
            );

            setUserData(result.data);
            navigate("/");
        } catch (error) {
            setErr(
                error.response?.data?.message ||
                "Server not reachable. Is the backend running?"
            );
        } finally {
            setLoading(false);
        }
    };

    // Password show/hide
    const handleClick = () => {
        setShow((prev) => !prev);
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-white">

            {/* Logo */}
            <div className="flex w-full items-center p-4 sm:p-5">
                <img
                    className="h-auto w-24 cursor-pointer sm:w-28"
                    src={logo}
                    alt="LinkedIn Logo"
                    onClick={() => navigate("/")}
                />
            </div>

            {/* Login Form */}
            <div className="flex w-full flex-1 items-center justify-center px-4 py-6">
                <form
                    onSubmit={handleSignin}
                    className="flex min-h-[500px] w-[90%] max-w-[400px] flex-col justify-center gap-4 rounded-xl p-5 sm:min-h-[550px] sm:p-7 md:shadow-xl"
                >
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        Sign In
                    </h1>

                    {/* Email Input */}
                    <div className="flex w-full items-center gap-2 rounded-lg border px-3 focus-within:border-blue-500">
                        <MdEmail className="shrink-0 text-xl text-gray-500" />

                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            required
                            autoComplete="email"
                            className="w-full min-w-0 p-2 outline-none"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex w-full items-center rounded-lg border px-2 focus-within:border-blue-500">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={show ? "text" : "password"}
                            placeholder="Password"
                            required
                            autoComplete="current-password"
                            className="w-full min-w-0 rounded-lg p-2 outline-none"
                        />

                        <button
                            type="button"
                            onClick={handleClick}
                            aria-label={show ? "Hide password" : "Show password"}
                            className="cursor-pointer px-2 text-blue-600"
                        >
                            {show ? (
                                <IoEyeOffOutline size={21} />
                            ) : (
                                <IoEyeOutline size={21} />
                            )}
                        </button>
                    </div>

                    {/* Error Message */}
                    {err && (
                        <p className="text-center font-semibold text-red-600">
                            *{err}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>

                    {/* Signup Link */}
                    <p className="text-center text-sm sm:text-base">
                        Create an account?

                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="ml-1 cursor-pointer text-blue-500 hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;