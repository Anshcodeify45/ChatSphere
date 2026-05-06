import { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "../utils/auth";

function Contacts({ setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user = getUser();
  const currentUserId = user?._id;

  /* RESPONSIVE */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* FETCH USERS */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://chatsphere-s39q.onrender.com/api/auth/users"
        );

        const filtered = (res.data || []).filter(
          (u) => u._id !== currentUserId
        );

        setUsers(filtered);
      } catch (err) {
        console.log("FETCH USERS ERROR:", err.message);
      }
    };

    if (currentUserId) fetchUsers();
  }, [currentUserId]);

  /* SEARCH FILTER */
  const filteredUsers = users.filter((u) =>
    (u?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: isMobile ? "#020617" : "transparent",
      }}
    >

      {/* HEADER */}
      <div
        style={{
          padding: "15px",
          fontSize: isMobile ? "16px" : "18px",
          fontWeight: "bold",
          borderBottom: "1px solid #374151",
          color: "white",
        }}
      >
        Contacts
      </div>

      {/* SEARCH */}
      <div style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: isMobile ? "10px" : "8px",
            borderRadius: "6px",
            border: "none",
            outline: "none",
            background: "#1e293b",
            color: "white",
            fontSize: isMobile ? "14px" : "13px",
            
          }}
        />
      </div>

      {/* LIST */}
      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          scrollbarWidth: "none",
                msOverflowStyle: "none",
        }}
      >
        {filteredUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: isMobile ? "12px" : "10px",
              marginBottom: "8px",
              borderRadius: "10px",
              cursor: "pointer",
              background: "#1e293b",
              transition: "0.2s",
            }}
          >
            {/* AVATAR */}
            <div
              style={{
                width: isMobile ? "42px" : "35px",
                height: isMobile ? "42px" : "35px",
                borderRadius: "50%",
                background: "#4b5563",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
                fontWeight: "bold",
                color: "white",
                fontSize: isMobile ? "16px" : "14px",
              }}
            >
              {u?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* NAME */}
            <span
              style={{
                color: "white",
                fontSize: isMobile ? "15px" : "14px",
              }}
            >
              {u?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contacts;