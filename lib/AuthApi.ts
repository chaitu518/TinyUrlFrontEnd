import axios from "axios";

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
