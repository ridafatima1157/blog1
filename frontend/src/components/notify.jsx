import React, { useContext } from "react";
import { NotificationContext } from "../Context/NotificationContext.jsx";

const Notify = () => {
  const { notifications, markAllAsRead } = useContext(NotificationContext);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6">Notifications</h2>

      <button
        onClick={markAllAsRead}
        className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        Mark all as read
      </button>

      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n, idx) => (
            <li
              key={idx}
              className="p-3 rounded-md bg-white shadow-[1px_2px_6px_grey] hover:shadow-md transition w-full flex justify-between items-center"
            >
              {n.type === "like" && (
                <p>
                  <strong>{n.senderName}</strong> liked your post{" "}
                  <span className="text-blue-600">{n.postTitle}</span>
                </p>
              )}
              {n.type === "comment" && (
                <p>
                  <strong>{n.senderName}</strong> commented on your post{" "}
                  <span className="text-blue-600">{n.postTitle}</span>
                </p>
              )}
              <p className="text-sm text-gray-500">
                {n.time ? new Date(n.time).toLocaleString() : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notify;
