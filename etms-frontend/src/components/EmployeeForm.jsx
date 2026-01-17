import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const EmployeeForm = ({ onSaved }) => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submit = async () => {
    try {
      if (!form.name || !form.email || !form.password) {
        toast.error("All fields are required");
        return;
      }

      await api.post("/employees", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
        // 🚫 NO ROLE — backend will FORCE EMPLOYEE
      });

      toast.success("Employee created");
      setShow(false);
      setForm({ name: "", email: "", password: "" });
      onSaved();

    } catch (err) {
      console.error("EMP CREATE FAILED:", err.response?.data || err);
      toast.error("Employee creation failed");
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setShow(true)}>
        + Add Employee
      </button>

      {show && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Create Employee</h5>

              <input
                className="form-control mb-2"
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="form-control mb-2"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />

              {/* 🔒 ROLE REMOVED COMPLETELY */}

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  onClick={submit}
                >
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

export default EmployeeForm;
