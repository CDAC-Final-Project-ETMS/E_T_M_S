import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../api/authApi";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    token: state?.token || "",
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
      await resetPasswordApi({
        token: form.token,
        newPassword: form.newPassword
      });

      toast.success("Password reset successfully!");
      navigate("/login");

    } catch (err) {
      toast.error("Invalid or expired token");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h4>🔑 Reset Password</h4>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Reset Token"
          name="token"
          value={form.token}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="New Password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button className="btn btn-success w-100">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
