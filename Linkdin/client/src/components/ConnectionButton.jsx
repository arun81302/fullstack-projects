import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { HiOutlineClock } from "react-icons/hi";

const ConnectionButton = ({ userId }) => {
  const { serverUrl } = useContext(authDataContext);

  const [status, setStatus] = useState("loading");
  const [requestId, setRequestId] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch current connection status.
  const fetchStatus = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection/status/${userId}`,
        { withCredentials: true }
      );

      setStatus(result.data.status);
      setRequestId(result.data.requestId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStatus();
    }
  }, [userId]);

  // send connection request.
  const sendRequest = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/connection/request/${userId}`,
        {},
        { withCredentials: true }
      );

      await fetchStatus();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      await fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  // cancel connection request.
  const cancelRequest = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `${serverUrl}/api/connection/cancel/${requestId}`,
        { withCredentials: true }
      );

      await fetchStatus();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // accept connection request.
  const acceptRequest = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${serverUrl}/api/connection/accept/${requestId}`,
        {},
        { withCredentials: true }
      );

      await fetchStatus();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // rejec request.
  const rejectRequest = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${serverUrl}/api/connection/reject/${requestId}`,
        {},
        { withCredentials: true }
      );

      await fetchStatus();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <button
        disabled
        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-gray-400"
      >
        Loading...
      </button>
    );
  }

  if (status === "self") {
    return null;
  }

  if (status === "connected") {
    return (
      <button
        disabled
        className="flex items-center gap-2 rounded-full border border-gray-400 px-4 py-1.5 text-sm font-semibold text-gray-600"
      >
        <FaUserCheck />
        Connected
      </button>
    );
  }

  if (status === "sent") {
    return (
      <button
        onClick={cancelRequest}
        disabled={loading}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-400 px-4 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <HiOutlineClock size={18} />
        {loading ? "Please wait..." : "Pending"}
      </button>
    );
  }

  if (status === "received") {
    return (
      <div className="flex gap-2">
        <button
          onClick={acceptRequest}
          disabled={loading}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IoCheckmark size={18} />
          Accept
        </button>

        <button
          onClick={rejectRequest}
          disabled={loading}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-400 px-4 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IoClose size={18} />
          Reject
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={sendRequest}
      disabled={loading}
      className="flex cursor-pointer items-center gap-2 rounded-full border border-blue-600 px-4 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FaUserPlus size={15} />
      {loading ? "Sending..." : "Connect"}
    </button>
  );
};

export default ConnectionButton;