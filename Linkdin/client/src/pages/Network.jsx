import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Nav from "../components/Nav";
import ConnectionButton from "../components/ConnectionButton";

import { authDataContext } from "../context/AuthContext";

import dp from "../assets/profile.png";

import { FaUserFriends } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { FaCheck, FaTimes } from "react-icons/fa";

const Network = () => {
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Network ka data fetch karo
  const fetchNetworkData = async () => {
    try {
      setLoading(true);

      const [requestResult, connectionResult, suggestionResult] =
        await Promise.all([
          axios.get(
            `${serverUrl}/api/connection/requests/received`,
            { withCredentials: true }
          ),

          axios.get(
            `${serverUrl}/api/connection/all`,
            { withCredentials: true }
          ),

          axios.get(
            `${serverUrl}/api/user/suggestions`,
            { withCredentials: true }
          ),
        ]);

      setRequests(requestResult.data.requests || []);
      setConnections(connectionResult.data.connections || []);
      setSuggestions(suggestionResult.data.users || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Page load hone par data lao
  useEffect(() => {
    fetchNetworkData();
  }, []);

  // Request accept ya reject karo
  const handleRequest = async (requestId, action) => {
    try {
      setActionLoading(requestId);

      await axios.put(
        `${serverUrl}/api/connection/${action}/${requestId}`,
        {},
        { withCredentials: true }
      );

      await fetchNetworkData();
    } catch (error) {
      console.log(error);
    } finally {
      setActionLoading(null);
    }
  };

  // Request mein sender aur connection mein person milega
  const getPerson = (item) => item.sender || item;

  // Common person card
  const PersonCard = ({ person, children }) => (
    <div className="flex items-center justify-between gap-3 border-b p-4 last:border-none">
      {/* Profile par click karne se profile open hogi */}
      <div
        onClick={() => navigate(`/profile/${person._id}`)}
        className="flex min-w-0 cursor-pointer items-center gap-3"
      >
        <img
          src={person.profileImage || dp}
          alt="profile"
          className="h-12 w-12 rounded-full object-cover"
        />

        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800">
            {person.firstName} {person.lastName}
          </h3>

          <p className="truncate text-sm text-gray-500">
            {person.headline || person.userName}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Nav />

      <div className="mx-auto max-w-5xl px-3 pb-10 pt-24">

        <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
          <FaUserFriends className="text-[#0A66C2]" />
          My Network
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading network...
          </p>
        ) : (
          <div className="space-y-5">

            {/* Invitations Section */}
            <section className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b p-5">
                <IoPersonAddOutline className="text-xl text-[#0A66C2]" />

                <h2 className="text-lg font-bold">
                  Invitations ({requests.length})
                </h2>
              </div>

              {requests.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">
                  No pending invitations.
                </p>
              ) : (
                requests.map((request) => {
                  const person = getPerson(request);
                  const isLoading = actionLoading === request._id;

                  return (
                    <PersonCard
                      key={request._id}
                      person={person}
                    >
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleRequest(request._id, "reject")
                        }
                        className="flex cursor-pointer items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaTimes />
                        Ignore
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleRequest(request._id, "accept")
                        }
                        className="flex cursor-pointer items-center gap-1 rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaCheck />
                        {isLoading ? "Wait..." : "Accept"}
                      </button>
                    </PersonCard>
                  );
                })
              )}
            </section>

            {/* Connections Section */}
            <section className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b p-5">
                <FaUserFriends className="text-xl text-[#0A66C2]" />

                <h2 className="text-lg font-bold">
                  Your Connections ({connections.length})
                </h2>
              </div>

              {connections.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">
                  You have no connections yet.
                </p>
              ) : (
                connections.map((person) => (
                  <PersonCard
                    key={person._id}
                    person={person}
                  />
                ))
              )}
            </section>

            {/* Suggestions Section */}
            <section className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b p-5">
                <IoPersonAddOutline className="text-xl text-[#0A66C2]" />

                <h2 className="text-lg font-bold">
                  People You May Know
                </h2>
              </div>

              {suggestions.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">
                  No suggestions available.
                </p>
              ) : (
                suggestions.map((person) => (
                  <PersonCard
                    key={person._id}
                    person={person}
                  >
                    <ConnectionButton userId={person._id} />
                  </PersonCard>
                ))
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
};

export default Network;