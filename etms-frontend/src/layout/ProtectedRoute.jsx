import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed
  return <Outlet />;
}
