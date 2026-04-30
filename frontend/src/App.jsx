import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppLayout() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  // hide navbar on auth pages OR when not logged in
  const hideNavbar =
    !user ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/login" element={!user ? <Login /> : <Dashboard />} />
        <Route path="/register" element={!user ? <Register /> : <Dashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}