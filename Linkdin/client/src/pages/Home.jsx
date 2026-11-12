import Nav from "../components/Nav"
import dp from '../assets/profile.png'
import { FaPlus } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useContext } from "react";
import { UserDataContext } from "../context/userContext";
import EditProfile from "../components/EditProfile";

const Home = () => {

    let { userData, edit, setEdit } = useContext(UserDataContext)

    return (
        <>

            {/* Edit Profile Modal */}
            {edit && <EditProfile />}

            <Nav />

            <div className="w-full min-h-screen bg-[#ddddd6] pt-[80px] px-3.5">

                {/* Main Container */}
                <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-start items-start gap-3">

                    {/* Left Section */}
                    <div className="p-[10px] w-full md:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg">

                        {/* Cover Image */}
                        <div className="relative w-full h-[100px] bg-gray-300 rounded-md">

                            {userData?.coverImage && (
                                <img
                                    src={userData.coverImage}
                                    alt="cover"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            )}

                            {/* Camera Icon */}
                            <div
                                className="absolute top-2 right-2 size-8 flex items-center justify-center cursor-pointer"
                                onClick={() => setEdit(true)}
                            >
                                <IoCameraOutline className="text-[#0A66C2] text-xl" />
                            </div>

                        </div>

                        {/* Profile Image */}
                        <div className="relative size-16 sm:size-18 overflow-visible rounded-full mt-[-45px] ml-[20px]">

                            <img
                                src={userData?.profileImage || dp}
                                alt="user image"
                                className="w-full h-full object-cover rounded-full"
                            />

                            {/* Plus Button */}
                            <div
                                className="absolute bottom-0 right-0 size-6 bg-[#0A66C2] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md border-2 border-white"
                                onClick={() => setEdit(true)}
                            >
                                <FaPlus className="text-xs" />
                            </div>

                        </div>

                        {/* User Details */}
                        <div className="w-full mt-3 text-left">

                            <h2 className="text-lg font-semibold text-gray-800">
                                {userData
                                    ? `${userData.firstName} ${userData.lastName}`
                                    : "Loading..."}
                            </h2>

                            <p className="text-sm text-gray-600 mt-0.5">
                                {userData?.headline || ""}
                            </p>

                            <p className="text-sm text-gray-500 mt-0.5">
                                {userData?.location || ""}
                            </p>

                        </div>

                        {/* Edit Profile Button */}
                        <div className="w-full flex justify-center mt-4">

                            <button
                                onClick={() => setEdit(true)}
                                className="w-full border border-[#0A66C2] px-3 py-1 rounded-full text-[#0A66C2] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition cursor-pointer"
                            >
                                <FiEdit className="text-base" />
                                Edit Profile
                            </button>

                        </div>

                    </div>

                    {/* Middle Section */}
                    <div className="p-[10px] w-full md:w-[50%] min-h-[200px] bg-white shadow-lg rounded-lg">
                    </div>

                    {/* Right Section */}
                    <div className="p-[10px] w-full md:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg">
                    </div>

                </div>
            </div>
        </>
    )
}

export default Home