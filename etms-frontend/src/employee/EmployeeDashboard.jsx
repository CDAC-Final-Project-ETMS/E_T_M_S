import { Link, Outlet, useLocation } from "react-router-dom";

const EmployeeDashboard = () => {
  const location = useLocation();
  const name = localStorage.getItem("name");

  const active = (path) =>
    location.pathname.includes(path)
      ? "active fw-bold"
      : "";

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 bg-secondary text-white min-vh-100 p-3">
          <h5 className="text-center mb-4">
            👨‍💼 Employee Panel
          </h5>

          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${active(
                  "/employee"
                )}`}
                to="/employee"
              >
                📝 My Tasks
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link text-white ${active(
                  "/history"
                )}`}
                to="/employee/history"
              >
                📜 My History
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link text-white ${active(
                  "/password"
                )}`}
                to="/employee/password"
              >
                🔑 Change Password
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-md-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>
              Welcome 👋 {name || "Employee"}
            </h4>
            <span className="badge bg-info">
              EMPLOYEE
            </span>
          </div>

          <div className="card shadow-sm p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
