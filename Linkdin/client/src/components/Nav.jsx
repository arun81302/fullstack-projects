import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import logo from "../assets/linkdin.png";
import dp from "../assets/profile.png";

import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/userContext";

import NotificationsPanel from "./NotificationsPanel";
import UserSearch from "./UserSearch";

import { CiSearch } from "react-icons/ci";
import { IoMdHome, IoMdNotifications } from "react-icons/io";
import { FaUserFriends, FaUserCircle } from "react-icons/fa";
import {
  IoMdArrowDropdown,
  IoMdClose,
  IoLogOutOutline,
} from "react-icons/io5";

const Nav = () => {
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(UserDataContext);

  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Unread notifications count
  const fetchNotificationCount = useCallback(async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/notification/all`,
        { withCredentials: true }
      );

      setUnreadCount(result.data.unreadCount || 0);
    } catch (err) {
      console.log(err);
    }
  }, [serverUrl]);

  // Har 10 second mein count update
  useEffect(() => {
    fetchNotificationCount();

    const interval = setInterval(fetchNotificationCount, 10000);

    return () => clearInterval(interval);
  }, [fetchNotificationCount]);

  // Logout API
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      setUserData(null);
      setShowProfile(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  // Home page par navigate ya refresh
  const handleHomeClick = () => {
    setShowProfile(false);
    setShowNotifications(false);
    setShowMobileSearch(false);

    if (window.location.pathname === "/") {
      window.dispatchEvent(new Event("home:refresh"));
    } else {
      navigate("/");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Network page open
  const handleNetworkClick = () => {
    setShowProfile(false);
    setShowNotifications(false);
    setShowMobileSearch(false);
    navigate("/network");
  };

  // Mobile search toggle
  const handleMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
    setShowProfile(false);
    setShowNotifications(false);
  };

  return (
    <nav className="fixed top-0 left-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-3 shadow-sm sm:px-6 lg:px-10">

      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <img
          src={logo}
          alt="LinkedIn"
          className="h-9 w-9 shrink-0 cursor-pointer object-contain"
          onClick={handleHomeClick}
        />

        {/* Desktop Search */}
        <div className="hidden w-full max-w-md md:block">
          <UserSearch />
        </div>

        {/* Mobile Search Icon */}
        <button
          onClick={handleMobileSearch}
          aria-label="Toggle search"
          className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          {showMobileSearch ? (
            <IoMdClose size={25} />
          ) : (
            <CiSearch size={27} />
          )}
        </button>
      </div>

      {/* Right Section */}
      <div className="flex h-full shrink-0 items-center gap-3 sm:gap-6">

        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="hidden h-full cursor-pointer flex-col items-center justify-center text-gray-600 hover:text-black lg:flex"
        >
          <IoMdHome size={23} />
          <span className="text-xs">Home</span>
        </button>

        {/* My Network */}
        <button
          onClick={handleNetworkClick}
          className="flex h-full cursor-pointer flex-col items-center justify-center text-gray-600 hover:text-black"
        >
          <FaUserFriends size={22} />
          <span className="hidden text-xs sm:block">
            My Network
          </span>
        </button>

        {/* Notifications */}
        <div className="relative flex h-full items-center">
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfile(false);
              setShowMobileSearch(false);
            }}
            aria-label="Notifications"
            className="relative flex cursor-pointer flex-col items-center justify-center text-gray-600 hover:text-black"
          >
            <IoMdNotifications size={24} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            <span className="hidden text-xs sm:block">
              Notifications
            </span>
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <NotificationsPanel
              onClose={() => setShowNotifications(false)}
              onUpdate={fetchNotificationCount}
            />
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile((prev) => !prev);
              setShowNotifications(false);
              setShowMobileSearch(false);
            }}
            aria-label="Profile menu"
            className="flex cursor-pointer items-center gap-1"
          >
            <img
              src={userData?.profileImage || dp}
              alt="profile"
              className="h-9 w-9 rounded-full border object-cover"
            />

            <IoMdArrowDropdown className="hidden sm:block" />
          </button>

          {/* Profile Menu */}
          {showProfile && (
            <div className="absolute top-12 right-0 z-50 w-56 rounded-lg border bg-white p-3 shadow-xl">

              <div className="flex items-center gap-3 border-b pb-3">
                <img
                  src={userData?.profileImage || dp}
                  alt="profile"
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {userData?.firstName} {userData?.lastName}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {userData?.headline}
                  </p>
                </div>
              </div>

              {/* View Profile */}
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate(`/profile/${userData?._id}`);
                }}
                className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                <FaUserCircle size={17} />
                View Profile
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <IoLogOutOutline size={19} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className="absolute top-16 left-0 z-50 w-full border-b bg-white px-4 py-3 shadow-md md:hidden">
          <UserSearch />
        </div>
      )}

    </nav>
  );
};

export default Nav;