import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));
       window.location.href = "/";
    } catch (err) {
      alert("Invalid credentials");
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
      {/*LEFT SIDE (LOGIN) */}
      <div
        style={{
          width: "40%",
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
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
            color: "white",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "25px" ,color:"#FFFFFF"}}>
            ChatSphere Login
          </h2>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              width: "93%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              background: "#1e293b",
              color: "white",
            }}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              width: "93%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              background: "#1e293b",
              color: "white",
            }}
          />

          {/* Button */}
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.background = "#2563eb")}
          >
            Login
          </button>

          {/* Register */}
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#60a5fa" }}>
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          width: "60%",
          position: "relative",
        }}
      >
        <img
          src="/login-bg.jpg"
          alt="background"
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
    </div>
  );
}

export default Login;