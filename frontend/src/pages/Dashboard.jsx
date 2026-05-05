import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Contacts from "../components/Contacts";

function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ RESTORE selected user after reload
  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      setSelectedUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ HANDLE USER CLICK + SAVE
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

 

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        width: "100%",
        overflow: "hidden",
        fontFamily: "Arial"
      }}
    >
      {/* LEFT PANEL */}
      <div style={{
        width: "20%",
        minWidth: "220px",
        background: "#111827",
        color: "white",
        borderRight: "1px solid #374151",
        display: "flex",
        flexDirection: "column"
      }}>
        <Sidebar setSelectedUser={handleSelectUser} /> {/* 🔥 FIX */}
      </div>

      {/* CENTER */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0f172a"
      }}>
        <Chat selectedUser={selectedUser} />
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: "20%",
        minWidth: "220px",
        background: "#020617",
        color: "white",
        borderLeft: "1px solid #374151",
        display: "flex",
        flexDirection: "column"
      }}>
        <Contacts setSelectedUser={handleSelectUser} /> {/* 🔥 FIX */}
      </div>
    </div>
  );
}

export default Dashboard;