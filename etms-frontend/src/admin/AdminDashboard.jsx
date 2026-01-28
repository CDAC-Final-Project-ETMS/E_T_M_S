import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/employeeApi";
import { fetchAllTasks, getAllHistory } from "../api/taskApi";

const AdminDashboard = () => {
  const email = localStorage.getItem("email");
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    employees: 0,
    activeTasks: 0,
    completed: 0,
    deleted: 0
  });

  const active = (path) =>
    location.pathname.includes(path) ? "active fw-bold" : "";

  const isHome =
    location.pathname === "/admin" ||
    location.pathname === "/admin/";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [empRes, taskRes, historyRes] = await Promise.all([
        fetchEmployees(),
        fetchAllTasks(),
        getAllHistory()
      ]);

      const tasks = taskRes.data;
      const history = historyRes.data;

      setStats({
        employees: empRes.data.length,
        activeTasks: tasks.filter(t => t.status !== "DONE").length,
        completed: history.filter(h => h.finalStatus === "DONE").length,
        deleted: history.filter(h => h.finalStatus === "DELETED").length
      });
    } catch (err) {
      console.error("Dashboard stats failed", err);
    }
  };

  const Card = ({ title, value, icon, color }) => (
    <div className="col-md-3">
      <div className="card shadow-sm border-0 text-center h-100">
        <div className="card-body">
          <div className={`fs-1 ${color}`}>{icon}</div>
          <h6 className="mt-2">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white min-vh-100 p-3">
          <h5 className="text-center mb-4">⚙ Admin Panel</h5>

          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <Link className={`nav-link text-white ${active("/admin")}`} to="/admin">
                📊 Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link text-white ${active("/employees")}`} to="/admin/employees">
                👥 Employees
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link text-white ${active("/tasks")}`} to="/admin/tasks">
                📝 Tasks
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link text-white ${active("/history")}`} to="/admin/history">
                📜 History
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link text-white ${active("/audit-logs")}`} to="/admin/audit-logs">
                🧾 Audit Logs
              </Link>
            </li>
          </ul>
        </div>

        {/* Main */}
        <div className="col-md-10 p-4">

          {/* Top Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Welcome, {email || "Admin"} 👋</h4>
            <span className="badge bg-success">ADMIN</span>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <Card title="Total Employees" value={stats.employees} icon="👥" color="text-primary" />
            <Card title="Active Tasks" value={stats.activeTasks} icon="📝" color="text-warning" />
            <Card title="Completed" value={stats.completed} icon="✅" color="text-success" />
            <Card title="Deleted" value={stats.deleted} icon="🗑" color="text-danger" />
          </div>

          {/* Content */}
          <div className="card shadow-sm border-0 p-4">

            {isHome ? (
              <>
                {/* Welcome Panel */}
                <h5 className="mb-2">👋 Welcome back, Admin</h5>
                <p className="text-muted mb-4">
                  Here's a quick overview of what's happening in your organization today.
                </p>

                {/* Quick Actions */}
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate("/admin/employees")}
                    >
                      ➕ Add Employee
                    </button>
                  </div>

                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-success w-100"
                      onClick={() => navigate("/admin/tasks")}
                    >
                      ➕ Create Task
                    </button>
                  </div>

                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-warning w-100"
                      onClick={() => navigate("/admin/history")}
                    >
                      📜 View History
                    </button>
                  </div>

                  <div className="col-md-3">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => navigate("/admin/audit-logs")}
                    >
                      🧾 Audit Logs
                    </button>
                  </div>
                </div>

                {/* Tip Card */}
                <div className="alert alert-info">
                  💡 <strong>Tip of the Day:</strong> Assign clear deadlines to improve task completion rate.
                </div>

                {/* Empty State Footer */}
                <div className="text-center text-muted mt-4">
                  📊 Select a section from the sidebar to manage your system.
                </div>
              </>
            ) : (
              <Outlet />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
