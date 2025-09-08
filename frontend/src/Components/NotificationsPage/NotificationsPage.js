import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaGift,
  FaBullhorn,
  FaCog,
  FaBell,
} from "react-icons/fa";
import "./NotificationsPage.css";

const socket = io("http://localhost:5001", {
  withCredentials: true,
});

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  // ✅ Fetch stored notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/notifications/my/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setNotifications(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    socket.on("notification", (data) => {
      console.log("📢 New notification:", data);
      setNotifications((prev) => [data, ...prev]); 
    });

    return () => {
      socket.off("notification"); 
    };
  }, [userId]);

  const typeMap = {
    transaction: {
      icon: <FaMoneyBillWave color="green" />,
      label: "Transaction",
    },
    reward: { icon: <FaGift color="orange" />, label: "Reward" },
    offer: { icon: <FaBullhorn color="blue" />, label: "Offer" },
    system: { icon: <FaCog color="gray" />, label: "System" },
    alert: { icon: <FaBell color="red" />, label: "Alert" },
  };

  return (
    <div className="notification-page">
      <div className="notification-page-header df">My Notifications</div>

      {notifications.length === 0 ? (
        <div className="no-notifications df">No notifications yet!</div>
      ) : (
        <ul className="notification-container">
          {notifications?.map?.((note, index) => {
            const { icon, label } = typeMap[note.type] || typeMap.alert; // fallback
            return (
              <li key={index} className="notification-tile">
                <div className="notification-icon">{icon}</div>
                <div className="notification-content">
                  <div className="notification-message">{note.message}</div>
                  <div className="notification-meta">
                    {label} •{" "}
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
