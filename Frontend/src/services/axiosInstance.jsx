/**
 * axiosInstance.js — Shared axios client with all API endpoints.
 *
 * Import this file anywhere in the app and call the endpoint you need.
 * To change the server, update BASE_URL here only.
 *
 * Usage:
 *   import axiosInstance from "../services/axiosInstance";
 *   await axiosInstance.post("/auth/register", { name, username, email, password });
 *   await axiosInstance.post("/auth/login", { identifier, password });
 *   await axiosInstance.get("/posts/feed");
 */

import axios from "axios";

const axiosInstance = axios.create({
  baseURL:         "http://localhost:3000",
  withCredentials: true,
  headers:         { "Content-Type": "application/json" },
});

export default axiosInstance;