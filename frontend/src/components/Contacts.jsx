import { useEffect, useState } from "react";
import axios from "axios";

function Contacts({ setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
const currentUserId = user?._id;

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://chatsphere-s39q.onrender.com/api/auth/users"
      );

      console.log("USERS:", res.data);

      const filtered = res.data.filter(
        (user) => user._id !== currentUserId
      );

      setUsers(filtered);
    } catch (err) {
      console.log("FETCH USERS ERROR:", err.response?.data || err.message);
    }
  };

  fetchUsers();
}, [currentUserId]);

  // 🔍 Search filter
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          borderBottom: "1px solid #374151"
        }}
      >
        Contacts
      </div>

      {/* Search */}
      <div style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "none",
            outline: "none",
            background: "#1e293b",
            color: "white"
          }}
        />
      </div>

      {/* Contact List */}
      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px"
        }}
      >
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#1e293b"
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

            {/* Name */}
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contacts;