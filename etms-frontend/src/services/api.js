import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// 🔐 Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚨 Global 401 / 403 handling
api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;

    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

  // ❌ DO NOT auto-redirect on API 403
// Let the UI handle it via toast or logic
if (status === 403) {
  console.warn("403 from API:", err.config?.url);
}


    return Promise.reject(err);
  }
);

export default api;
