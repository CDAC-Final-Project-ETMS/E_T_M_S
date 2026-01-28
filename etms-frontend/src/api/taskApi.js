import api from "../services/api";

export const fetchAllTasks = () =>
  api.get("/tasks");

export const createTask = (data) =>
  api.post("/tasks", {
    title: data.title,
    description: data.description,
    empId: Number(data.empId),
    dueDate: data.dueDate,
    priority: data.priority
  });

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

export const updateTaskStatus = (id, status) =>
  api.put(`/tasks/${id}/status?status=${status}`);

export const getMyTasks = () =>
  api.get("/tasks/my");

export const completeTask = (id) =>
  api.post(`/tasks/${id}/complete`);

export const getAllHistory = () =>
  api.get("/tasks/history");

export const getMyHistory = () =>
  api.get("/tasks/history/my");

export const fetchTasksByEmployee = (id) =>
  api.get(`/tasks/employee/${id}`);

// 🔍 AUDIT LOG APIs (ADMIN)

export const getAllAuditLogs = () =>
  api.get("/admin/audit-logs");

export const getAuditLogsByEmail = (email) =>
  api.get(`/admin/audit-logs/user?email=${email}`);

// 💬 COMMENTS APIs

export const getCommentsForTask = (taskId) =>
  api.get(`/tasks/${taskId}/comments`);

export const getEmployeeComments = (taskId) =>
  api.get(`/tasks/my/${taskId}/comments`);

export const addCommentToTask = (taskId, comment) =>
  api.post(`/tasks/${taskId}/comments`, { comment });

// 🔥 BACKWARD-COMPATIBILITY EXPORTS (DO NOT REMOVE)

export const addComment = (taskId, data) =>
  api.post(`/tasks/${taskId}/comments`, data);

export const getAdminCommentsForTask = (taskId) =>
  api.get(`/tasks/${taskId}/comments`);
