// src/api/client.js

const API_BASE = "http://127.0.0.1:5000";

// Read JWT token
export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// JSON requests (GET, POST, PUT, DELETE)
export async function apiJSON(path, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(), // include JWT
  };

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
}

// FormData requests (file upload)
export async function apiForm(path, method = "POST", formData) {
  const headers = {
    ...getAuthHeader(), // include JWT
    // DO NOT set Content-Type — browser handles it
  };

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: formData,
  });

  return res;
}

// Export functions

