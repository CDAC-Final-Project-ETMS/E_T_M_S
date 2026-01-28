import { useEffect, useState } from "react";
import api from "../services/api";

const TaskHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        api.get("/tasks/history").then(res => setHistory(res.data));
    }, []);

    return (
        <div className="container-fluid">
            <h4>📜 Task History</h4>

            <div className="card mt-3 shadow-sm">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Employee ID</th>
                                <th>Status</th>
                                <th>Completed At</th>
                                <th>Deleted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((h, index) => (
                                <tr key={h.historyId || `${h.taskId}-${index}`}>
                                    <td>{h.title}</td>
                                    <td>{h.assignedTo}</td>
                                    <td>
                                        <span
                                            className={`badge ${h.finalStatus === "DONE"
                                                    ? "bg-success"
                                                    : h.finalStatus === "DELETED"
                                                        ? "bg-danger"
                                                        : "bg-secondary"
                                                }`}
                                        >
                                            {h.finalStatus}
                                        </span>
                                    </td>
                                    <td>{h.completedAt || "—"}</td>
                                    <td>{h.deletedAt || "—"}</td>
                                </tr>
                            ))}

                            {history.length === 0 && (
                                <tr key="empty-row">
                                    <td colSpan="5" className="text-center text-muted">
                                        No history records
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default TaskHistory;
