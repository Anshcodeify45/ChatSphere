import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [lastMessages, setLastMessages] = useState({});

  const senderId = "69ec4fab48df3ed351a7b649";

   useEffect(() => {
  axios
    .get("http://localhost:8080/api/auth/users")
    .then((res) => {
      setUsers(res.data);

      const temp = {};

      for (let user of res.data) {
        temp[user._id] = "Click to start chat"; // placeholder
      }

      setLastMessages(temp);
    })
    .catch((err) => console.log(err));
}, []);

  const handleClick = (user) => {
    setSelectedUser(user);
    setActiveUserId(user._id);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {users.map((user) => {
        const isActive = activeUserId === user._id;

        return (
          <div
            key={user._id}
            onClick={() => handleClick(user)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              background: isActive ? "#1f2937" : "transparent",
              marginBottom: "8px"
            }}
          >
            {/* Avatar */}
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#4b5563",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              color: "white",
              fontWeight: "bold"
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + Last Message */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "15px" }}>{user.name}</span>

              <span style={{
                fontSize: "12px",
                color: "#9ca3af",
                maxWidth: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {lastMessages[user._id] || "Loading..."}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;