import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ setSelectedUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/users")
      .then(res => setUsers(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h3>Users</h3>

      {users.map(user => (
        <div 
          key={user._id}
          onClick={() => setSelectedUser(user)}
          style={{ cursor: "pointer", margin: "10px 0" }}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;