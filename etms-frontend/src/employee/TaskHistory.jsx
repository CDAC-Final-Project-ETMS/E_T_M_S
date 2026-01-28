import { useEffect, useState } from "react";
import { fetchMyHistory } from "../api/taskHistoryApi";

const TaskHistory = () => {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const res = await fetchMyHistory();
    setHistory(res.data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">📜 My Task History</h4>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-primary">
              <tr>
                <th>Title</th>
                <th>Final Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Completed At</th>
                <th>Deleted At</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No task history found
                  </td>
                </tr>
              )}

              {history.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>
                    <span
                      className={`badge ${
                        t.finalStatus === "DONE"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {t.finalStatus}
                    </span>
                  </td>
                  <td>{t.priority}</td>
                  <td>{t.dueDate || "—"}</td>
                  <td>{t.completedAt || "—"}</td>
                  <td>{t.deletedAt || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
