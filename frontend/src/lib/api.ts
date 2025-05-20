// frontend/src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  withCredentials: true, // optional kalau pakai cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // gunakan key yang konsisten
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
