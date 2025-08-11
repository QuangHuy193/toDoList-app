import API from "./axiosInstance";

export const createTask = (taskData) => API.post("/tasks/create", taskData);

export const getTasks = () => API.get("/tasks/read");

export const deleteTaskById = (id) => API.delete(`/tasks/delete/${id}`);
