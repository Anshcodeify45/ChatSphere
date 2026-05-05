import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#020617", // dark theme
        color: "white",
        borderBottom: "1px solid #1e293b"
      }}
    >
      {/*   App Name */}
      <h2 style={{ fontWeight: "bold", letterSpacing: "1px" ,color:"#FFFFFF"}}>
        Chatsphere
      </h2>

      {/* Right Side */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link
              to="/login"
              style={{
                color: "#cbd5f5",
                textDecoration: "none"
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: "#cbd5f5",
                textDecoration: "none"
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* User Avatar */}
            <div
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Username */}
            <span style={{ fontSize: "14px", color: "#cbd5f5" }}>
              {user.name}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;