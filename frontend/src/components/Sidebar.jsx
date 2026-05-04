import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

function Sidebar({ setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [lastMessages, setLastMessages] = useState({});

  // ✅ Get logged-in user dynamically
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const senderId = currentUser?._id;

const fetchConversations = () => {
  if (!senderId) return;

  axios
    .get(`http://localhost:8080/api/messages/conversations/${senderId}`)
    .then((res) => {
      console.log("SIDEBAR DATA:", res.data);

      const filteredUsers = res.data.filter(
        (user) => String(user._id) !== String(senderId)
      );

      setUsers(filteredUsers);

      const temp = {};
      filteredUsers.forEach((user) => {
        temp[user._id] = "Start chatting...";
      });

      setLastMessages(temp);
    })
    .catch((err) => console.log(err));
};

useEffect(() => {
  fetchConversations();
}, [senderId]);

useEffect(() => {
  socket.on("refresh_sidebar", fetchConversations);

  return () => {
    socket.off("refresh_sidebar", fetchConversations);
  };
}, []);

const handleClick = (user) => {
  setSelectedUser(user);
  setActiveUserId(user._id);
};
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* 🔥 Scrollbar Hidden CSS */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          borderBottom: "1px solid #374151"
        }}
      >
        Chats
      </div>

      {/* Chat List */}
      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px"
        }}
      >
        {users.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            No chats yet
          </p>
        )}

        {users.map((user) => {
          const isActive = activeUserId === user._id;

          return (
            <div
              key={user._id}
              onClick={() => handleClick(user)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                background: isActive ? "#1f2937" : "#1e293b",
                transition: "0.2s"
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  background: "#4b5563",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                  fontWeight: "bold"
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + Last Message */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px" }}>{user.name}</span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    maxWidth: "140px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {lastMessages[user._id] || "No messages"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;