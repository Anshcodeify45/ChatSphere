import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  let user = null;

  try {
    const data = localStorage.getItem("user");

    if (data && data !== "undefined" && data !== "null") {
      user = JSON.parse(data);
    }
  } catch (err) {
    console.log("ProtectedRoute parse error:", err);
    localStorage.removeItem("user");
  }

  if (!user || !user._id) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;