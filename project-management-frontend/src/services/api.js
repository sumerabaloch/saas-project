import axios from "axios";

/* =========================
   BASE CONFIG
========================= */
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   TOKEN INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   AUTH APIs
========================= */
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getCurrentUser: () => api.get("/auth/me"),
};

/* =========================
   PROJECT APIs
========================= */
export const projectAPI = {
  getAllProjects: () => api.get("/projects"),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

/* =========================
   TASK APIs
========================= */
export const taskAPI = {
  getMyTasks: () => api.get("/tasks/my-tasks"),
  getAllTasks: (projectId) => api.get(`/tasks/project/${projectId}`),
  createTask: (projectId, data) =>
    api.post(`/tasks/project/${projectId}`, data),
  updateTask: (taskId, data) =>
    api.put(`/tasks/${taskId}`, data),
  deleteTask: (taskId) =>
    api.delete(`/tasks/${taskId}`),
};

/* =========================
   ACTIVITY APIs
========================= */
export const activityAPI = {
  getMyActivities: () => api.get("/activity"),          // user
  getAllActivities: () => api.get("/admin/activity"),  // admin
};

/* =========================
   ADMIN APIs
========================= */
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
};

/* =========================
   USER APIs (ADMIN)
========================= */
export const userAPI = {
  getAllUsers: () => api.get("/admin/users"),
  getUser: (id) => api.get(`/admin/users/${id}`),
};

export default api;