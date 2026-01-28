import { useState } from "react";
import { toast } from "react-toastify";
import { forgotPasswordApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await forgotPasswordApi(email);

      const resetToken = res.data.token; // 👈 from backend
      setToken(resetToken);

      toast.success("Reset token generated!");

      // Auto-redirect to reset page (optional)
      setTimeout(() => {
        navigate("/reset-password", {
          state: { token: resetToken, email }
        });
      }, 2000);

    } catch (err) {
      toast.error("Email not found");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h4>🔐 Forgot Password</h4>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100">
          Generate Reset Token
        </button>
      </form>

      {/* DEV MODE: Show token */}
      {token && (
        <div className="alert alert-warning mt-3">
          <strong>DEV MODE TOKEN:</strong>
          <div className="mt-2 text-break">{token}</div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
