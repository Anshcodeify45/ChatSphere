import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <Sidebar setSelectedUser={setSelectedUser} />
      </div>

      <div style={{ width: "70%" }}>
        {selectedUser ? (
          <Chat selectedUser={selectedUser} />
        ) : (
          <h3 style={{ padding: "20px" }}>Select a user to start chat</h3>
        )}
      </div>

    </div>
  );
}

export default Dashboard;