import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  if (!token) return <Navigate to="/login" />;

  if (adminOnly && role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}
