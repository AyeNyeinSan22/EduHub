// src/api/schedule.js
const API = "http://127.0.0.1:5000/api";

export async function getSchedule() {
  return fetch(`${API}/schedule`);
}

export async function createSchedule(data) {
  return fetch(`${API}/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateSchedule(id, data) {
  return fetch(`${API}/schedule/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteSchedule(id) {
  return fetch(`${API}/schedule/${id}`, {
    method: "DELETE",
  });
}

/**
 * Upload an array of items to backend by POSTing each item.
 * Backend creates items individually with POST /schedule
 * Returns array of responses (useful for debugging).
 */
export async function uploadSchedule(items) {
  const results = [];
  for (const it of items) {
    // basic validation skip empty rows
    if (!it.title?.trim() && (!it.start_time?.trim() && !it.location?.trim())) {
      continue;
    }
    // call createSchedule
    const res = await createSchedule({
      title: it.title,
      weekday: Number(it.weekday),
      start_time: it.start_time,
      location: it.location,
    });
    results.push(res);
  }
  return results;
}

export function deleteAllSchedule() {
  return fetch(`${API}/schedule`, {
    method: "DELETE"
  });
}
