import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Contacts from "../components/Contacts";
import WelcomeScreen from "../components/WelcomeScreen";
import { socket } from "../socket";
function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);



  useEffect(() => {
  socket.on("online_users", (users) => {
    setOnlineUsers(users);
  });

  return () => socket.off("online_users");
}, []);


  useEffect(() => {
  socket.on("receive_message", (msg) => {
    const senderId = msg.senderId;

    setContacts((prev) => {
      const existing = prev.find(c => c._id === senderId);

      // If contact already exists → update
      if (existing) {
        return prev.map(c =>
          c._id === senderId
            ? {
                ...c,
                lastMessage: msg.text,
                unread: (c.unread || 0) + 1,
              }
            : c
        );
      }

      // If NEW contact → add to sidebar
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
  });

  return () => socket.off("receive_message");
}, []);

  // Restore on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");

    if (savedUser) {
      try {
        setSelectedUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("selectedUser");
        setSelectedUser(null);
      }
    }
  }, []);

  // HANDLE USER SELECT
const handleSelectUser = (user) => {
  setSelectedUser(user);

  // reset unread
  setContacts((prev) =>
    prev.map((c) =>
      c._id === user._id ? { ...c, unread: 0 } : c
    )
  );

  localStorage.setItem("selectedUser", JSON.stringify(user));
};


  useEffect(() => {
    setSelectedUser(null);
    localStorage.removeItem("selectedUser");
  }, []);

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
      {/* LEFT PANEL */}
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

      {/* CENTER */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
        }}
      >
        {selectedUser ? (
          <Chat selectedUser={selectedUser}  onlineUsers={onlineUsers}/>
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* RIGHT PANEL */}
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