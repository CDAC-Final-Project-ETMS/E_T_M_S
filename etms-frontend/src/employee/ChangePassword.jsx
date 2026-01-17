import { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../api/authApi";

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });

      toast.success("Password changed successfully 🔐");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h5>🔑 Change Password</h5>

      <form onSubmit={handleSubmit} className="mt-3">
        <input
          type="password"
          name="oldPassword"
          className="form-control mb-2"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          className="form-control mb-2"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          className="form-control mb-3"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-100">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
