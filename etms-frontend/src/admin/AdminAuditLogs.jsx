import { useEffect, useState } from "react";
import { getAllAuditLogs, getAuditLogsByEmail } from "../api/taskApi";
import { toast } from "react-toastify";

const PAGE_SIZE = 30;

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Pagination state
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visibleLogs = logs.slice(start, end);

  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await getAllAuditLogs();
      setLogs(res.data);
      setPage(1); // reset page
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const searchByUser = async () => {
    if (!email) return loadAll();

    try {
      setLoading(true);
      const res = await getAuditLogsByEmail(email);
      setLogs(res.data);
      setPage(1); // reset page
    } catch {
      toast.error("No logs found for this user");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="container-fluid">
      <h4>🧾 Audit Logs</h4>

      {/* 🔍 Filter */}
      <div className="d-flex gap-2 my-3">
        <input
          className="form-control w-25"
          placeholder="Search by user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary" onClick={searchByUser}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={loadAll}>
          Reset
        </button>
      </div>

      {/* 📋 Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading && <div>Loading...</div>}

          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.userEmail}</td>
                  <td>
                    <span className="badge bg-info">{l.action}</span>
                  </td>
                  <td>{l.entityType}</td>
                  <td>{l.entityId || "—"}</td>
                  <td>{new Date(l.timestamp).toLocaleString()}</td>
                </tr>
              ))}

              {!loading && visibleLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🔢 Pagination Controls */}
          {logs.length > PAGE_SIZE && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted">
                Page {page} of {totalPages}
              </span>

              <div className="btn-group">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  ⬅ Prev
                </button>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next ➡
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
