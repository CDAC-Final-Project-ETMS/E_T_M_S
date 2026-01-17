import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const theme = useSelector((state) => state.theme.mode);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav
      className={`navbar navbar-expand-lg px-3 ${
        theme === "dark"
          ? "navbar-dark bg-dark"
          : "navbar-dark bg-primary"
      }`}
    >
      <Link
        className="navbar-brand fw-bold"
        to={role === "ADMIN" ? "/admin" : "/employee"}
      >
        🗂 ETMS
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {role === "ADMIN" && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin/employees"
                >
                  Employees
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin/tasks"
                >
                  Tasks
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin/history"
                >
                  History
                </NavLink>
              </li>
            </>
          )}

          {role === "EMPLOYEE" && (
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/employee"
                >
                  My Tasks
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/employee/history"
                >
                  My History
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/employee/password"
                >
                  Change Password
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "dark" ? "🌙 Dark" : "☀ Light"}
        </button>

        <button
          className="btn btn-light btn-sm"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
