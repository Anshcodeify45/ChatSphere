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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    socket.on("online_users", setOnlineUsers);
    return () => socket.off("online_users");
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowContacts(false); // close contacts after selecting
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      height: "90vh",
      width: "100%",
      fontFamily: "Arial",
      overflow: "hidden"
    }}>

      {/* LEFT SIDEBAR (hidden on mobile when contacts open) */}
      {(!isMobile || !showContacts) && (
        <div style={{
          width: isMobile ? "100%" : "20%",
          background: "#111827",
          borderRight: isMobile ? "none" : "1px solid #374151",
          display: "flex",
          flexDirection: "column",
        }}>
          <Sidebar
            contacts={contacts}
            setSelectedUser={handleSelectUser}
            onlineUsers={onlineUsers}
          />

          {/* MOBILE CONTACT BUTTON */}
          {isMobile && (
            <button
              onClick={() => setShowContacts(true)}
              style={{
                padding: "12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Open Contacts
            </button>
          )}
        </div>
      )}

      {/* CHAT AREA (hidden when contacts open on mobile) */}
      {(!isMobile || !showContacts) && (
        <div style={{
          flex: 1,
          background: "#0f172a",
          display: "flex",
          flexDirection: "column"
        }}>
          {selectedUser?._id ? (
            <Chat
              selectedUser={selectedUser}
              onlineUsers={onlineUsers}
            />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      )}

      {/* CONTACTS PANEL (FULL SCREEN ON MOBILE) */}
      {(showContacts || !isMobile) && (
        <div style={{
          width: isMobile ? "100%" : "20%",
          background: "#020617",
          borderLeft: isMobile ? "none" : "1px solid #374151",
          display: "flex",
          flexDirection: "column",
          position: isMobile ? "absolute" : "static",
          top: 0,
          left: 0,
          height: "100%",
          zIndex: 10,
        }}>
          
          {/* CLOSE BUTTON (mobile only) */}
          {isMobile && (
            <button
              onClick={() => setShowContacts(false)}
              style={{
                padding: "12px",
                background: "#ef4444",
                color: "white",
                border: "none",
              }}
            >
              Close Contacts
            </button>
          )}

          <Contacts setSelectedUser={handleSelectUser} />
        </div>
      )}

    </div>
  );
}

export default Dashboard;