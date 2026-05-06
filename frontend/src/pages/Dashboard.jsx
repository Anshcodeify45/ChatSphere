import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Contacts from "../components/Contacts";
import WelcomeScreen from "../components/WelcomeScreen";
import { socket } from "../socket";
import { getUser } from "../utils/auth";

function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const currentUser = getUser();

  // SOCKET: online users
  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online_users");
  }, []);

  // SOCKET: new messages → update contacts sidebar
  useEffect(() => {
    const handler = (msg) => {
      const senderId = msg.senderId;

      setContacts((prev) => {
        const exists = prev.find((c) => c._id === senderId);

        if (exists) {
          return prev.map((c) =>
            c._id === senderId
              ? {
                  ...c,
                  lastMessage: msg.text,
                  unread: selectedUser?._id === senderId ? 0 : (c.unread || 0) + 1,
                }
              : c
          );
        }

        return [
          {
            _id: senderId,
            name: msg.senderName || "New User",
            lastMessage: msg.text,
            unread: 1,
          },
          ...prev,
        ];
      });
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, [selectedUser]);

  // restore selected user from storage
  useEffect(() => {
    const saved = localStorage.getItem("selectedUser");

    if (saved && saved !== "undefined") {
      try {
        setSelectedUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("selectedUser");
      }
    }
  }, []);

  // handle user select
  const handleSelectUser = (user) => {
    setSelectedUser(user);

    setContacts((prev) =>
      prev.map((c) =>
        c._id === user._id ? { ...c, unread: 0 } : c
      )
    );

    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        width: "100%",
        overflow: "hidden",
        fontFamily: "Arial",
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "20%",
          minWidth: "220px",
          background: "#111827",
          color: "white",
          borderRight: "1px solid #374151",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sidebar
          contacts={contacts}
          setSelectedUser={handleSelectUser}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* CHAT AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
        }}
      >
        {selectedUser ? (
          <Chat
            selectedUser={selectedUser}
            onlineUsers={onlineUsers}
          />
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* RIGHT CONTACTS */}
      <div
        style={{
          width: "20%",
          minWidth: "220px",
          background: "#020617",
          color: "white",
          borderLeft: "1px solid #374151",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Contacts setSelectedUser={handleSelectUser} />
      </div>
    </div>
  );
}

export default Dashboard;