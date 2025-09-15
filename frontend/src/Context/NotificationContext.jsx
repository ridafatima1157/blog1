import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); // Logged-in user

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. Fetch saved notifications from API
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // 2. Setup socket
    const newSocket = io("http://localhost:8000", {
      auth: { token },
    });
    setSocket(newSocket);

    // Only add notifications for the logged-in user
    newSocket.on("newNotification", (data) => {
      // ✅ Only add if the recipient (userId) is the logged-in user
      if (data.userId === user._id) {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  const markAllAsRead = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
