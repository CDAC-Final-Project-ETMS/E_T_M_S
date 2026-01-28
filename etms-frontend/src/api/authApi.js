import api from "../services/api";

export const loginApi = (data) => api.post("/auth/login", data);
export const forgotPasswordApi = (email) =>
  api.post("/auth/forgot-password", { email });
export const changePassword = (data) =>
  api.post("/auth/change-password", data);
export const resetPasswordApi = (data) =>
  api.post("/auth/reset-password", data);
