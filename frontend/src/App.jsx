import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "./socket";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Register user globally
  useEffect(() => {
    if (user?._id) {
      socket.emit("add_user", user._id);
    }
  }, [user]);

  const hideNavbar =
    !user ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/register" element={!user ? <Register /> : <Dashboard />} />

         <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
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