import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { saveUser } from "../utils/auth";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://chatsphere-s39q.onrender.com/api/auth/login",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      saveUser(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={styles.wrapper}>

      {/* LEFT LOGIN */}
      <div
        style={{
          width: isMobile ? "100%" : "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={styles.card}>
          <h2 style={{ textAlign: "center", marginBottom: 25 ,color:'white'}}>
            ChatSphere Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={styles.input}
          />

          <button onClick={handleLogin} style={styles.button}>
            Login
          </button>

          <p style={styles.text}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#60a5fa" }}>
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT IMAGE (HIDES PROPERLY) */}
      {!isMobile && (
        <div style={styles.right}>
          <img src="/login-bg.jpg" style={styles.img} />

          <div style={styles.overlay} />

          <div style={styles.brand }>
            <h1 style={{color:'white'}}>ChatSphere 💬</h1>
            <p>Connect instantly with friends</p>
          </div>
        </div>
      )}

    </div>
  );
}


const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    fontFamily: "Arial",
    background: "#020617",
  },

  card: {
    width: "100%",
    maxWidth: "360px",
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
    color: "white",
  },

  input: {
    width: "93%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: "#1e293b",
    color: "white",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
  },

  text: {
    marginTop: "15px",
    fontSize: "14px",
    textAlign: "center",
    color: "#9ca3af",
  },

  right: {
    width: "60%",
    position: "relative",
    overflow: "hidden",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(2,6,23,0.95), rgba(2,6,23,0.2))",
  },

  brand: {
    position: "absolute",
    bottom: "40px",
    left: "40px",
    color: "white",
  },
};

export default Login;