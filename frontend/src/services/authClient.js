// src/services/authClient.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/clients";   // ← Important : /clients

const authClientAPI = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Auth API Functions ─────────────────────────────────────────────────────

export const apiRegister = async (payload) => {
  const res = await authClientAPI.post("/register", payload);
  return res.data;
};

export const apiLogin = async (payload) => {
  const res = await authClientAPI.post("/login", payload);
  return res.data;
};

export const apiVerifyOTP = async (payload) => {
  const res = await authClientAPI.post("/verify-otp", payload);
  return res.data;
};

export const apiResendOTP = async (payload) => {
  const res = await authClientAPI.post("/resend-otp", payload);
  return res.data;
};

// Optionnel : Mise à jour segmentation
export const apiUpdateSegment = async (clientId, payload) => {
  const res = await authClientAPI.put(`/${clientId}/segment`, payload);
  return res.data;
};

export default authClientAPI;