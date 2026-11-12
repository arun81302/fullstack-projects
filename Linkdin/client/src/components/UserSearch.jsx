import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

import { authDataContext } from "../context/AuthContext";
import dp from "../assets/profile.png";

const UserSearch = () => {
  const { serverUrl } = useContext(authDataContext);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search ko debounce karo
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        searchUsers();
      } else if (showResults) {
        getSuggestions();
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, showResults]);

  // Users search karo
  const searchUsers = async () => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${serverUrl}/api/user/search`,
        {
          params: { query },
          withCredentials: true,
        }
      );

      setUsers(result.data.users || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Suggested users fetch karo
  const getSuggestions = async () => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${serverUrl}/api/user/suggestions`,
        {
          withCredentials: true,
        }
      );

      setUsers(result.data.users || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // User profile open karo
  const openProfile = (userId) => {
    setQuery("");
    setShowResults(false);
    navigate(`/profile/${userId}`);
  };

  // Search clear karo
  const handleClear = () => {
    setQuery("");
    setShowResults(true);
  };

  // Bahar click hone par dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">

      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-full bg-[#edf3f8] px-4 py-2">
        <CiSearch className="shrink-0 text-2xl text-gray-600" />

        <input
          type="text"
          placeholder="Search users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="w-full bg-transparent text-sm outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-gray-200"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-12 left-0 z-50 max-h-[400px] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">

          <h3 className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
            {query ? "Search Results" : "People You May Know"}
          </h3>

          {loading && (
            <p className="p-4 text-sm text-gray-500">
              Loading...
            </p>
          )}

          {!loading && users.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No users found.
            </p>
          )}

          {/* Users List */}
          {!loading &&
            users.map((user) => (
              <button
                type="button"
                key={user._id}
                onClick={() => openProfile(user._id)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left hover:bg-gray-100"
              >
                <img
                  src={user.profileImage || dp}
                  alt="profile"
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {user.headline || user.userName}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;