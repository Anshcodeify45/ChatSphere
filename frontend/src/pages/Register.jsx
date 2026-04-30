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
    await axios.post("http://localhost:8080/api/auth/register", form);
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <br /><br />

      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <br /><br />

      <input type="password" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>
      <div style={{ marginTop: "10px" }}>
      Already have an account? <Link to="/login">Login</Link>
    </div>
    </div>
  );
}

export default Register;