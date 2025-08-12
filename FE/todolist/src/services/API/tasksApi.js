import API from "./axiosInstance";

export const createTask = (taskData) => API.post("/task/create", taskData);

export const getTasks = () => API.get("/task/read");

export const updateTask = (id, taskData) =>
  API.put(`/task/update/${id}`, taskData);

export const updateTaskStatus = (id, status) =>
  API.patch(`/task/update-status/${id}`, { status });

export const deleteTaskById = (id) => API.delete(`/task/delete/${id}`);
