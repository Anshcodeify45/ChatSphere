import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";
import { getUser } from "../utils/auth";

function Sidebar({ setSelectedUser, onlineUsers = [] }) {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [unread, setUnread] = useState({});

  const currentUser = getUser();
  const senderId = currentUser?._id;

  // FETCH CONVERSATIONS
  const fetchConversations = async () => {
    try {
      if (!senderId) return;

      const res = await axios.get(
        `https://chatsphere-s39q.onrender.com/api/messages/conversations/${senderId}`
      );

      const filteredUsers = res.data.filter(
        (u) => String(u._id) !== String(senderId)
      );

      setUsers(filteredUsers);

      const tempMessages = {};
      const tempUnread = {};

      filteredUsers.forEach((u) => {
        tempMessages[u._id] = "Start chatting...";
        tempUnread[u._id] = 0;
      });

      setLastMessages(tempMessages);
      setUnread(tempUnread);
    } catch (err) {
      console.log("FETCH CONVERSATIONS ERROR:", err.message);
    }
  };

  // LOAD ON LOGIN
  useEffect(() => {
    fetchConversations();
  }, [senderId]);

  // SOCKET REFRESH (SAFE)
  useEffect(() => {
    socket.on("refresh_sidebar", fetchConversations);

    return () => {
      socket.off("refresh_sidebar", fetchConversations);
    };
  }, [senderId]);

  // RECEIVE MESSAGE (FIXED MEMORY SAFE)
  useEffect(() => {
    const handler = (msg) => {
      const sender = msg.senderId;

      setUsers((prev) => {
        const exists = prev.find((u) => u._id === sender);

        if (!exists) {
          return [
            {
              _id: sender,
              name: msg.senderName || "User",
            },
            ...prev,
          ];
        }

        return prev;
      });

      setLastMessages((prev) => ({
        ...prev,
        [sender]: msg.text,
      }));

      setUnread((prev) => {
        if (sender === activeUserId) return prev;

        return {
          ...prev,
          [sender]: (prev[sender] || 0) + 1,
        };
      });
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [activeUserId]);

  // CLICK USER
  const handleClick = (user) => {
    setSelectedUser(user);
    setActiveUserId(user._id);

    setUnread((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{
        padding: "15px",
        fontSize: "18px",
        fontWeight: "bold",
        borderBottom: "1px solid #374151",
        color: "white",
      }}>
        Chats
      </div>

      {/* LIST */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {users.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            No chats yet
          </p>
        )}

        {users.map((u) => {
          const isActive = activeUserId === u._id;
          const unreadCount = unread[u._id] || 0;
          const isOnline = onlineUsers.includes(u._id);

          return (
            <div
              key={u._id}
              onClick={() => handleClick(u)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                background: isActive ? "#1f2937" : "#1e293b",
                justifyContent: "space-between",
              }}
            >

              {/* LEFT */}
              <div style={{ display: "flex", alignItems: "center" }}>

                <div style={{ position: "relative", marginRight: "10px" }}>
                  <div style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    background: "#4b5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}>
                    {u.name?.charAt(0).toUpperCase()}

                    <span style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: isOnline ? "#22c55e" : "#6b7280",
                      border: "2px solid #111827",
                    }} />
                  </div>
                </div>

                <div>
                  <div style={{ color: "white", fontSize: "14px" }}>
                    {u.name}
                  </div>

                  <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                    {lastMessages[u._id] || "No messages"}
                  </div>
                </div>
              </div>

              {/* UNREAD */}
              {unreadCount > 0 && (
                <div style={{
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  padding: "3px 7px",
                  fontSize: "12px",
                }}>
                  {unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;