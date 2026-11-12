import { useContext, useState } from "react";
import logo from "../assets/linkdin.png";
import { CiSearch } from "react-icons/ci";
import { IoMdHome } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import dp from "../assets/profile.png";
import { UserDataContext } from "../context/userContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { UNSAFE_getTurboStreamSingleFetchDataStrategy, useNavigate } from "react-router-dom";

const Nav = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showProfile, setShowProfile] = useState(false);   

  let { userData, setUserData } = useContext(UserDataContext);
  let navigate=useNavigate()
let {serverUrl}=useContext(authDataContext)
let handleSignOut=async()=>{
    try{
        let result=await axios.get(serverUrl+"/api/auth/logout",{withCredentials:true})
        setUserData(null)
         navigate("/login")
        console.log(result)
       
        
    }catch(err){
        console.log(err)
    }
}

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setShowSearch(false);
    }
  };

  return (
    <div className="w-full h-15 shadow-md bg-white fixed top-0 left-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10">

      {/* Logo */}
      <div className="shrink-0">
        <img className="w-10" src={logo} alt="linkedin logo" />
      </div>

      {/* Mobile and Tablet Search */}
      <div className="lg:hidden flex-1 min-w-0 mx-3">
        {showSearch ? (
          <form className="flex items-center bg-[#ddddd6] rounded-md px-2 py-2 w-full">
            <CiSearch className="w-5 h-5 shrink-0" />

            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search User"
              className="outline-none bg-transparent w-full ml-2 min-w-0"
            />
          </form>
        ) : (
          <CiSearch
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowSearch(true)}
          />
        )}
      </div>

      {/* Desktop Search */}
      <div className="hidden lg:flex flex-1 justify-center px-6 min-w-0">
        <form className="flex items-center bg-[#ddddd6] w-full max-w-[450px] px-3 py-2 rounded-md">
          <CiSearch className="w-5 h-5 shrink-0" />

          <input
            type="text"
            placeholder="Search User"
            className="outline-none bg-transparent w-full ml-2"
          />
        </form>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-5 sm:gap-7 lg:gap-8 shrink-0">

        {/* Home */}
        <div className="hidden lg:flex flex-col items-center cursor-pointer">
          <IoMdHome className="w-[22px] h-[22px]" />
          <div className="text-xs">Home</div>
        </div>

        {/* My Networks */}
        <div className="hidden sm:flex flex-col items-center cursor-pointer">
          <FaUserFriends className="w-[22px] h-[22px]" />
          <div className="text-xs">My Networks</div>
        </div>

        {/* Notification */}
        <div className="flex flex-col items-center cursor-pointer">
          <IoMdNotifications className="w-[22px] h-[22px]" />
          <div className="hidden sm:block text-xs">Notification</div>
        </div>

        {/* Profile */}
        <div className="relative">

          {/* Profile Image */}
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="size-9 sm:size-10 overflow-hidden rounded-full cursor-pointer"
          >
            <img
              src={userData.profileImage || dp}
              alt="user image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute top-full right-0 mt-3 w-[250px] sm:w-[280px] max-w-[calc(100vw-20px)] bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col items-center py-5 px-4">

              {/* User Image */}
              <div className="size-16 overflow-hidden rounded-full">
                <img
                  src={userData.profileImage || dp}
                  alt="user image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Name */}
              <div className="font-semibold text-base mt-2 text-center">
                {userData?.firstName} {userData?.lastName}
              </div>

              {/* View Profile */}
              <button className="border-2 border-blue-400 px-10 py-1 rounded-2xl text-blue-400 mt-3 hover:bg-blue-50 transition">
                View Profile
              </button>

              <div className="w-full mt-4 border-b border-gray-200"></div>

              {/* My Networks */}
              <div className="flex items-center gap-2 w-full py-3 cursor-pointer hover:bg-gray-50 px-3 rounded-md">
                <FaUserFriends className="w-[22px] h-[22px]" />
                <div className="text-sm">My Networks</div>
              </div>

              {/* Sign Out */}
              <button onClick={handleSignOut} className="cursor-pointer border-2 border-red-400 px-10 py-1 rounded-2xl text-red-400 mt-2 hover:bg-red-50 transition">
                Sign Out
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Nav;