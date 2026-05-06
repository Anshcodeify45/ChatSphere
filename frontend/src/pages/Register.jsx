import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // simple responsive check (no redesign)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleRegister = async () => {
    try {
      if (!form.name || !form.email || !form.password) {
        alert("Please fill all fields");
        return;
      }

      const res = await axios.post(
        "https://chatsphere-s39q.onrender.com/api/auth/register",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("REGISTER RESPONSE:", res.data);

      alert("Registered successfully");
      navigate("/login", { replace: true });

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div
      style={{
        height: "98vh",
        display: "flex",
        fontFamily: "Arial",
        background: "#020617",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          width: isMobile ? "100%" : "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "350px",
            padding: "30px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
            color: "white",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "25px" ,color:'white'}}>
            Create Account
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={inputStyle}
          />

          <button onClick={handleRegister} style={buttonStyle}>
            Register
          </button>

          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#60a5fa" }}>
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (IMAGE ONLY ON DESKTOP) */}
      {!isMobile && (
        <div style={{ width: "60%", position: "relative" }}>
          <img
            src="/login-bg.jpg"
            alt="bg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to right, #020617 10%, transparent 80%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "93%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  background: "#1e293b",
  color: "white",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Register;