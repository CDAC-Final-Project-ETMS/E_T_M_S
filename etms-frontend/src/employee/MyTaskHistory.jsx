import { useEffect, useState } from "react";
import { getMyHistory } from "../api/taskApi";

const MyTaskHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getMyHistory().then(res => setHistory(res.data));
  }, []);

  return (
    <div>
      <h5>📜 My Task History</h5>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Completed At</th>
          </tr>
        </thead>
        <tbody>
          {history.map(h => (
            <tr key={h.taskId}>
              <td>{h.title}</td>
              <td>{h.finalStatus}</td>
              <td>{h.completedAt || "—"}</td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No history yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyTaskHistory;
