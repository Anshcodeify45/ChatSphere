import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/login");
  window.location.reload(); 
};

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 20px",
      background: "#075e54",
      color: "white"
    }}>
      <h3>Chat App</h3>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        ) : (
          <>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={{
              padding: "5px 10px",
              border: "none",
              cursor: "pointer"
            }}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;