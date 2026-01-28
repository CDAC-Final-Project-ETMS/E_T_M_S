import { useEffect, useState } from "react";
import {
  addComment,
  getAdminCommentsForTask,
  getEmployeeComments
} from "../api/taskApi";
import { toast } from "react-toastify";

const TaskComments = ({ taskId }) => {
  const role = localStorage.getItem("role");
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res =
        role === "ADMIN"
          ? await getAdminCommentsForTask(taskId)
          : await getEmployeeComments(taskId);

      setComments(res.data);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!text.trim()) return;

    try {
      await addComment(taskId, { comment: text });
      setText("");
      toast.success("Comment added");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  useEffect(() => {
    load();
  }, [taskId]);

  return (
    <div className="border rounded p-2 bg-light">
      <h6 className="fw-bold mb-2">💬 Comments</h6>

      {loading && <div className="text-muted small">Loading...</div>}

      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {comments.map(c => (
          <div key={c.id} className="border-bottom py-1">
            <div className="small text-muted">
              {c.employee?.email || "System"} ·{" "}
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <div>{c.comment}</div>
          </div>
        ))}

        {!loading && comments.length === 0 && (
          <div className="text-muted small">No comments yet</div>
        )}
      </div>

      {/* 🔓 BOTH ADMIN + EMPLOYEE CAN ADD */}
      <div className="input-group mt-2">
        <input
          className="form-control form-control-sm"
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button className="btn btn-sm btn-primary" onClick={submit}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TaskComments;
