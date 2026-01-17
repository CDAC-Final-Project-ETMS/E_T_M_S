import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./layout/Navbar";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ProtectedRoute from "./layout/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import Employees from "./admin/Employees";
import EmployeeDashboard from "./employee/EmployeeDashboard";
import Tasks from "./admin/Tasks";
import AdminTaskHistory from "./admin/TaskHistory";
import MyTasks from "./employee/MyTasks";
import MyTaskHistory from "./employee/MyTaskHistory";
import ChangePassword from "./employee/ChangePassword";
import Unauthorized from "./app/Unauthorized";
import ResetPassword from "./auth/ResetPassword";
import AdminAuditLogs from "./admin/AdminAuditLogs";

function App() {
  const location = useLocation();

  // ❌ Hide navbar on public auth pages
  const hideNavbarOn = ["/", "/login", "/forgot-password", "/reset-password"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>

        {/* 🌐 Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🚫 Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔐 ADMIN ROUTES */}
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<div>Select a section from sidebar</div>} />
            <Route path="employees" element={<Employees />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="history" element={<AdminTaskHistory />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>
        </Route>

        {/* 🔐 EMPLOYEE ROUTES */}
        <Route element={<ProtectedRoute roles={["EMPLOYEE"]} />}>
          <Route path="/employee" element={<EmployeeDashboard />}>
            <Route index element={<MyTasks />} />
            <Route path="history" element={<MyTaskHistory />} />
            <Route path="password" element={<ChangePassword />} />
          </Route>
        </Route>

      </Routes>

      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
}

export default App;
