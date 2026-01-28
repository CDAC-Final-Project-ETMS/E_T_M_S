import { useEffect, useState } from "react";
import { fetchEmployees, deactivateEmployee } from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import { toast } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const currentEmail = localStorage.getItem("email");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetchEmployees();
      setEmployees(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load employees", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?"))
      return;

    try {
      await deactivateEmployee(id);
      toast.success("Employee deactivated", { autoClose: 3000 });
      loadEmployees();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "You cannot deactivate this account";

      toast.warn(msg, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      employees.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h4>👥 Employees</h4>
        <EmployeeForm onSaved={loadEmployees} />
      </div>

      <input
        className="form-control mb-3"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <div className="text-muted">Loading employees...</div>}

      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th width="150">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((e) => {
            const isAdmin = e.role?.roleName === "ADMIN";
            const isSelf = e.email === currentEmail;

            const disabled = isAdmin || isSelf;
            const reason = isSelf
              ? "You cannot deactivate your own account"
              : isAdmin
              ? "Admin accounts cannot be deactivated"
              : "";

            return (
              <tr key={e.empId}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>
                  <span
                    className={`badge ${
                      isAdmin ? "bg-dark" : "bg-primary"
                    }`}
                  >
                    {e.role?.roleName}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      e.status === "ACTIVE"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>

                <td>
                  {e.status === "ACTIVE" && (
                    <button
                      className={`btn btn-sm ${
                        disabled ? "btn-outline-secondary" : "btn-danger"
                      }`}
                      disabled={disabled}
                      title={disabled ? reason : "Deactivate employee"}
                      onClick={() => !disabled && deactivate(e.empId)}
                    >
                      {disabled ? "Not Allowed" : "Deactivate"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {!loading && filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Employees;
