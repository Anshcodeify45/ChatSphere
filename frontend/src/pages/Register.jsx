import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("https://chatsphere-s39q.onrender.com/api/auth/register", form);
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        fontFamily: "Arial",
        background: "#020617",
      }}
    >
      {/* LEFT SIDE  */}
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
            Create Account
          </h2>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            onClick={handleRegister}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "#22c55e",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#16a34a")}
            onMouseOut={(e) => (e.target.style.background = "#22c55e")}
          >
            Register
          </button>

          {/* Login Link */}
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Already have an account?{" "}
            <Link to="/" style={{ color: "#60a5fa" }}>
              Login
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

export default Register;