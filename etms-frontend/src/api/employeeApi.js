import api from "../services/api";

export const fetchEmployees = () =>
  api.get("/employees");

export const createEmployee = (data) =>
  api.post("/employees", data);

export const deactivateEmployee = (id) =>
  api.delete(`/employees/${id}`);
