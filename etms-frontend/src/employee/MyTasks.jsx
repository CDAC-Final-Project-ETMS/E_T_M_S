import { useEffect, useState } from "react";
import {
  getMyTasks,
  completeTask,
  updateTaskStatus,
  addComment,
  getEmployeeComments
} from "../api/taskApi";
import { toast } from "react-toastify";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [newComment, setNewComment] = useState("");

  const load = async () => {
    const res = await getMyTasks();
    setTasks(res.data);
  };

  const markDone = async (id) => {
    try {
      await completeTask(id);
      toast.success("Task completed 🎉");
      setTasks(prev => prev.filter(t => t.taskId !== id));
    } catch {
      toast.error("Failed to complete task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Status update failed");
    }
  };

  const openViewComments = async (task) => {
    try {
      setActiveTask(task);
      const res = await getEmployeeComments(task.taskId);
      setComments(res.data);
      setShowViewModal(true);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  const openAddComment = (task) => {
    setActiveTask(task);
    setNewComment("");
    setShowAddModal(true);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(activeTask.taskId, { comment: newComment });
      toast.success("Comment added");
      setShowAddModal(false);

      const res = await getEmployeeComments(activeTask.taskId);
      setComments(res.data);
    } catch {
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h5>📝 My Tasks</h5>

      <table className="table table-hover mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Due</th>
            <th>Priority</th>
            <th>Action</th>
            <th>Comments</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map(t => (
            <tr key={t.taskId}>
              <td>{t.title}</td>

              <td>
                <select
                  className="form-select form-select-sm"
                  value={t.status}
                  onChange={e =>
                    updateStatus(t.taskId, e.target.value)
                  }
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </td>

              <td>{t.dueDate || "—"}</td>

              <td>
                <span className="badge bg-secondary">
                  {t.priority}
                </span>
              </td>

              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => markDone(t.taskId)}
                >
                  ✔ Done
                </button>
              </td>

              {/* 🔥 COMMENTS COLUMN — 2 BUTTONS */}
              <td className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openViewComments(t)}
                >
                  👁 View
                </button>

                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => openAddComment(t)}
                >
                  ➕ Add
                </button>
              </td>
            </tr>
          ))}

          {tasks.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No tasks assigned 🎉
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 👁 VIEW COMMENTS MODAL */}
      {showViewModal && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">

              <h5>💬 Comments — {activeTask.title}</h5>

              <div
                className="border rounded p-2"
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

              <div className="text-end mt-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ➕ ADD COMMENT MODAL */}
      {showAddModal && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>➕ Add Comment — {activeTask.title}</h5>

              <textarea
                className="form-control"
                rows="3"
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
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

    </div>
  );
};

export default MyTasks;
