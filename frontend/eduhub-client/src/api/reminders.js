// src/api/reminders.js
import { apiJSON } from "./client";

// parse JSON or throw
async function parseJsonResponse(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || res.statusText || "API error");
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getReminders() {
  const res = await apiJSON("/api/reminders", "GET");
  return parseJsonResponse(res);
}

export async function createReminder(payload) {
  // payload: { title, description, remind_at } (ISO string)
  const res = await apiJSON("/api/reminders", "POST", payload);
  return parseJsonResponse(res);
}

export async function updateReminder(id, payload) {
  const res = await apiJSON(`/api/reminders/${id}`, "PUT", payload);
  return parseJsonResponse(res);
}

export async function deleteReminder(id) {
  const res = await apiJSON(`/api/reminders/${id}`, "DELETE");
  return parseJsonResponse(res);
}
