import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const { role } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role === "ADMIN") navigate("/admin");
      else if (role === "EMPLOYEE") navigate("/employee");
      else navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [role, navigate]);

  return (
    <div className="text-center mt-5">
      <h2>🚫 Unauthorized</h2>
      <p>You don’t have permission to access this page.</p>
      <p>Redirecting you to your dashboard...</p>
    </div>
  );
};

export default Unauthorized;
