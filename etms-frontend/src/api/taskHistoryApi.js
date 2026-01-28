import api from "../services/api";

export const fetchAllHistory = () => api.get("/tasks/history");

export const fetchMyHistory = () => api.get("/tasks/history/my");
