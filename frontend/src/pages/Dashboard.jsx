import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Contacts from "../components/Contacts"; // 👈 NEW

function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "87vh",        // 🔥 full screen
        width: "100%",
        overflow: "hidden",     // 🔥 no page scroll
        fontFamily: "Arial"
      }}
    >
      {/* LEFT PANEL - Chats */}
      <div
        style={{
          width: "20%",
          minWidth: "220px",
          background: "#111827",
          color: "white",
          borderRight: "1px solid #374151",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Sidebar setSelectedUser={setSelectedUser} />
      </div>

      {/* CENTER PANEL - Chat */}
      <div
        style={{
          flex: 1,                     // 🔥 auto fill
          display: "flex",
          flexDirection: "column",
          background: "#0f172a"
        }}
      >
        <Chat selectedUser={selectedUser} />
      </div>

      {/* RIGHT PANEL - Contacts */}
      <div
        style={{
          width: "20%",
          minWidth: "220px",
          background: "#020617",
          color: "white",
          borderLeft: "1px solid #374151",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Contacts setSelectedUser={setSelectedUser} />
      </div>
    </div>
  );
}

export default Dashboard;