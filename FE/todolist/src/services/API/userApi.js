import API from "./axiosInstance";

export const login = (userData) => API.post("/auth/login", userData);

export const register = (userData) => API.post("/auth/register", userData);

export const getUserInfo = (userData) => API.get("/auth/me", userData);
