import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { authDataContext } from "../context/AuthContext";

import dp from "../assets/profile.png";

import { IoClose, IoCheckmarkDone } from "react-icons/io5";
import { FaCheck, FaTimes } from "react-icons/fa";

import timeAgo from "../utils/timeAgo";

const NotificationsPanel = ({ onClose, onUpdate }) => {
  const { serverUrl } = useContext(authDataContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Notifications fetch karo
  const fetchNotifications = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/notification/all`,
        { withCredentials: true }
      );

      setNotifications(result.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
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

      await fetchNotifications();
      onUpdate?.();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Sabhi notifications read karo
  const markAllRead = async () => {
    try {
      await axios.put(
        `${serverUrl}/api/notification/read-all`,
        {},
        { withCredentials: true }
      );

      await fetchNotifications();
      onUpdate?.();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 sm:absolute sm:inset-auto sm:right-0 sm:top-14 sm:w-96 sm:bg-transparent">
      <div className="ml-auto flex h-full w-full flex-col bg-white shadow-xl sm:h-[500px] sm:rounded-xl sm:border">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Notifications</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              <IoCheckmarkDone size={16} />
              Mark all read
            </button>

            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="cursor-pointer rounded-full p-1 hover:bg-gray-100"
            >
              <IoClose size={23} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-5 text-center text-sm text-gray-500">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <p className="p-5 text-center text-sm text-gray-500">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => {
              const sender = notification.sender;
              const connection = notification.connection;

              const isPending =
                notification.type === "connection_request" &&
                connection?.status === "pending";

              return (
                <div
                  key={notification._id}
                  className={`border-b p-4 ${
                    notification.isRead ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={sender?.profileImage || dp}
                      alt="profile"
                      className="h-11 w-11 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">
                          {sender?.firstName} {sender?.lastName}
                        </span>{" "}
                        sent you a connection request.
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {timeAgo(notification.createdAt)}
                      </p>

                      {/* Pending Request Actions */}
                      {isPending && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() =>
                              handleRequest(connection._id, "accept")
                            }
                            disabled={actionLoading === connection._id}
                            className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FaCheck size={11} />
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleRequest(connection._id, "reject")
                            }
                            disabled={actionLoading === connection._id}
                            className="flex cursor-pointer items-center gap-1 rounded-full border px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FaTimes size={11} />
                            Reject
                          </button>
                        </div>
                      )}

                      {!isPending && (
                        <p className="mt-2 text-xs text-gray-500">
                          Request {connection?.status || "updated"}.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;