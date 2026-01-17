import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi } from "../api/authApi";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginApi(form);

      const { token, role, name, email } = res.data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const finalRole = role || payload.role;
      const finalEmail = email || payload.sub;

      localStorage.setItem("token", token);
      localStorage.setItem("role", finalRole);
      localStorage.setItem("email", finalEmail);
      localStorage.setItem("name", name);

      toast.success("Login successful");
      navigate(finalRole === "ADMIN" ? "/admin" : "/employee");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)"
      }}
    >
      <div className="container">
        <div className="row justify-content-center align-items-center">

          {/* LEFT INFO PANEL */}
          <div className="col-lg-6 d-none d-lg-block pe-5 text-light">
            <div className="mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
                style={{
                  width: 64,
                  height: 64,
                  background: "linear-gradient(135deg,#2563eb,#38bdf8)"
                }}
              >
                📋
              </div>
              <h1 className="fw-bold display-5 mb-2">ETMS</h1>
              <p className="text-secondary fs-5 mb-3">
                Employee Task Management System
              </p>
              <p className="fst-italic text-secondary">
                Manage tasks. Track progress. Stay accountable.
              </p>
            </div>

            <div className="row g-3 mt-4">
              {[
                { icon: "✅", title: "Task Tracking", desc: "Monitor all work items" },
                { icon: "💬", title: "Team Comments", desc: "Discuss tasks in real-time" },
                { icon: "📊", title: "Progress Reports", desc: "Performance insights" },
                { icon: "🔒", title: "Secure Access", desc: "Role-based control" }
              ].map((f, i) => (
                <div key={i} className="col-md-6">
                  <div
                    className="p-4 rounded-4 h-100"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    <div className="fs-4 mb-2">{f.icon}</div>
                    <h6 className="fw-semibold mb-1 text-light">
                      {f.title}
                    </h6>
                    <small className="text-secondary">
                      {f.desc}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOGIN CARD */}
          <div className="col-lg-5 col-md-8 col-sm-10">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: 22,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.12)"
              }}
            >
              <div className="card-body p-5 text-light">

                <div className="text-center mb-4">
                  <div
                    className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 72,
                      height: 72,
                      background:
                        "linear-gradient(135deg,#2563eb,#38bdf8)"
                    }}
                  >
                    👤
                  </div>
                  <h2 className="fw-bold mb-1">Sign In</h2>
                  <p className="text-secondary">
                    Access your workspace
                  </p>
                </div>

                <form onSubmit={handleSubmit}>

                  {/* EMAIL */}
                  <div className="mb-4 position-relative">
                    <span
                      className="position-absolute top-50 translate-middle-y ms-3 text-secondary"
                    >
                      📧
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg ps-5"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white"
                      }}
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-4 position-relative">
                    <span
                      className="position-absolute top-50 translate-middle-y ms-3 text-secondary"
                    >
                      🔒
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      className="form-control form-control-lg ps-5 pe-5"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white"
                      }}
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y me-3"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? "🙈" : "👁"}
                    </button>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="btn w-100 fw-semibold py-3 fs-5"
                    disabled={loading}
                    style={{
                      background:
                        "linear-gradient(135deg,#2563eb,#38bdf8)",
                      border: "none",
                      color: "#020617",
                      borderRadius: 14
                    }}
                  >
                    {loading ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <span className="spinner-border spinner-border-sm"></span>
                        Signing in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <a
                    href="/forgot-password"
                    className="text-decoration-none text-secondary fw-semibold"
                  >
                    Forgot password?
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
