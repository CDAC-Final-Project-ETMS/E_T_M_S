import { useEffect, useState } from "react";
import {
  fetchAllTasks,
  deleteTask,
  fetchTasksByEmployee
} from "../api/taskApi";
import TaskForm from "../components/TaskForm";
import { toast } from "react-toastify";
import { fetchEmployees } from "../api/employeeApi";
import { getCommentsForTask, addCommentToTask } from "../api/taskApi";
import TaskComments from "../components/TaskComments";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAllTasks();
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(id);
      toast.success("Task deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openComments = async (task) => {
    setActiveTask(task);
    const res = await getCommentsForTask(task.taskId);
    setComments(res.data);
    setShowComments(true);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    await addCommentToTask(activeTask.taskId, newComment);
    setNewComment("");

    const res = await getCommentsForTask(activeTask.taskId);
    setComments(res.data);
  };

  useEffect(() => {
    load();
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await fetchEmployees();
    setEmployees(res.data);
  };

  const statusBadge = (status) => {
    if (status === "DONE") return "bg-success";
    if (status === "IN_PROGRESS") return "bg-warning";
    if (status === "OVERDUE") return "bg-danger";
    return "bg-secondary";
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h4>📝 Tasks</h4>
        <TaskForm onSaved={load} />
      </div>

      {loading && <div>Loading tasks...</div>}

      <select
        className="form-select mb-3 w-25"
        value={selectedEmp}
        onChange={async (e) => {
          const id = e.target.value;
          setSelectedEmp(id);

          if (!id) {
            load();
          } else {
            const res = await fetchTasksByEmployee(id);
            setTasks(res.data);
          }
        }}
      >
        <option value="">All Employees</option>
        {employees.map(e => (
          <option key={e.empId} value={e.empId}>
            {e.name}
          </option>
        ))}
      </select>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due</th>
            <th width="120">Action</th>
            <th>Comments</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map(t => (
            <tr key={t.taskId}>
              <td>{t.title}</td>
              <td>{t.assignedTo?.email || "—"}</td>

              {/* 🔒 ADMIN: READ-ONLY STATUS */}
              <td>
                <span className={`badge ${statusBadge(t.status)}`}>
                  {t.status}
                </span>
              </td>

              <td>{t.dueDate || "—"}</td>

              <td className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openComments(t)}
                >
                  💬
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(t.taskId)}
                >
                  🗑
                </button>
              </td>

              <td>
                <TaskComments taskId={t.taskId} />
              </td>
            </tr>
          ))}

          {!loading && tasks.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* COMMENTS MODAL */}
      {showComments && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">

              <h5>💬 Comments — {activeTask.title}</h5>

              <div
                className="border rounded p-2 mb-3"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {comments.map(c => (
                  <div key={c.id} className="mb-2">
                    <strong>{c.employee?.email || "Admin"}</strong>
                    <small className="text-muted ms-2">
                      {new Date(c.createdAt).toLocaleString()}
                    </small>
                    <div>{c.comment}</div>
                    <hr />
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-muted text-center">
                    No comments yet
                  </div>
                )}
              </div>

              <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowComments(false)}
                >
                  Close
                </button>

                <button
                  className="btn btn-primary"
                  onClick={submitComment}
                >
                  Send
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tasks;
