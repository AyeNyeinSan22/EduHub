// src/api/schedule.js
import { apiJSON } from "./client";

// GET all schedule entries
export async function getSchedule() {
  return apiJSON("/api/schedule", "GET");
}

// CREATE schedule entry
export async function createSchedule(form) {
  return apiJSON("/api/schedule", "POST", form);
}

// UPDATE schedule entry
export async function updateSchedule(id, form) {
  return apiJSON(`/api/schedule/${id}`, "PUT", form);
}

// DELETE schedule entry
export async function deleteSchedule(id) {
  return apiJSON(`/api/schedule/${id}`, "DELETE");
}
// BULK UPLOAD schedule entries (JSON array)
export async function uploadSchedule(data) {
  return apiJSON("/api/schedule/upload", "POST", data);
}
