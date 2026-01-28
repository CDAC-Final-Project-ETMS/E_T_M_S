import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/employeeApi";
import { createTask } from "../api/taskApi";
import { toast } from "react-toastify";

const TaskForm = ({ onSaved }) => {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    empId: "",
    dueDate: "",
    priority: "MEDIUM"
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchEmployees().then(res => {
      setEmployees(res.data);
    });
  }, []);

  const submit = async () => {

    if (!form.empId) {
      toast.error("Please assign the task to an employee");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      empId: parseInt(form.empId, 10),
      dueDate: form.dueDate,
      priority: form.priority || "MEDIUM"
    };

    if (isNaN(payload.empId)) {
      toast.error("Invalid employee selected");
      return;
    }

    try {
      await createTask(payload);
      toast.success("Task created");

      setShow(false);
      setForm({
        title: "",
        description: "",
        empId: "",
        dueDate: "",
        priority: "MEDIUM"
      });

      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setShow(true)}>
        + Add Task
      </button>

      {show && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Create Task</h5>

              <input
                className="form-control mb-2"
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                className="form-control mb-2"
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

              <select
                className="form-select mb-2"
                value={form.empId || ""}
                onChange={e => setForm({ ...form, empId: e.target.value })}
              >
                <option value="">Assign to...</option>

                {employees
                  .filter(e => e.role?.roleName === "EMPLOYEE")  // 🔥 HIDE ADMINS
                  .map(emp => (
                    <option key={emp.empId} value={emp.empId}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
              </select>

              <input
                type="date"
                className="form-control mb-2"
                min={today}          // 🔒 BLOCK PAST
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />

              <select
                className="form-control mb-3"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-success" onClick={submit}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskForm;
