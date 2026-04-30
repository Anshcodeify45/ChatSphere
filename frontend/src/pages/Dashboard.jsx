import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh",width: "100%" , fontFamily: "Arial"}}>

  {/* LEFT PANEL */}
  <div style={{
    width: "25%",
    background: "#111827",
    color: "white",
    padding: "15px"
  }}>
    <h2>Chats</h2>
    <Sidebar setSelectedUser={setSelectedUser} />
  </div>

  {/* RIGHT PANEL */}
  <div style={{
    width: "75%",
    display: "flex",
    flexDirection: "column",
    background: "#f3f4f6"
  }}>
    <Chat selectedUser={selectedUser} />
  </div>

</div>
  );
}

export default Dashboard;