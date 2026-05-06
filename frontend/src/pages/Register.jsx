import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { saveUser } from "../utils/auth";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // validation
      if (!form.name || !form.email || !form.password) {
        alert("Please fill all fields");
        return;
      }

      const res = await axios.post(
        "https://chatsphere-s39q.onrender.com/api/auth/register",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("REGISTER RESPONSE:", res.data);

      // ✅ SAFE SAVE (handles both {user} or direct user object)
      saveUser(res.data?.user || res.data);

      navigate("/");
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Register failed");
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
      {/* LEFT SIDE */}
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
          <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
            Create Account
          </h2>

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
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

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
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

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
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

          {/* BUTTON */}
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
            }}
          >
            Register
          </button>

          {/* LOGIN LINK */}
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
      <div style={{ width: "60%", position: "relative" }}>
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