// src/api/notes.js
import { apiJSON, apiForm } from "./client";
const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
/**
 * Returns parsed JSON from the response or throws if non-OK.
 */
async function parseJsonResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let err = text || res.statusText || "API request failed";
    throw new Error(err);
  }
  // try parse JSON, if empty return null
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* -------------------------
   Notes CRUD (FormData for uploads)
   ------------------------- */

export async function getNotes() {
  const res = await apiJSON("/api/notes", "GET");
  return parseJsonResponse(res);
}

export async function getNote(id) {
  const res = await apiJSON(`/api/notes/${id}`, "GET");
  return parseJsonResponse(res);
}

/**
 * createNote expects a FormData instance (file + cover etc.)
 * e.g.
 * const fd = new FormData();
 * fd.append("title", title);
 * fd.append("file", fileInput.files[0]);
 */
export async function createNote(formData) {
  const res = await apiForm("/api/notes", "POST", formData);
  return parseJsonResponse(res);
}

/**
 * updateNote: accepts FormData (same shape as create)
 */
export async function updateNote(id, formData) {
  const res = await apiForm(`/api/notes/${id}`, "PUT", formData);
  return parseJsonResponse(res);
}

export async function deleteNote(id) {
  const res = await apiJSON(`/api/notes/${id}`, "DELETE");
  return parseJsonResponse(res);
}

/* -------------------------
   Bookmarks / Annotations / Last page helpers (if backend supports)
   ------------------------- */

export async function getBookmarks(noteId) {
  const res = await apiJSON(`/api/notes/${noteId}/bookmarks`, "GET");
  return parseJsonResponse(res);
}

export async function addBookmark(noteId, payload) {
  const res = await apiJSON(`/api/notes/${noteId}/bookmarks`, "POST", payload);
  return parseJsonResponse(res);
}

export async function deleteBookmark(noteId, bookmarkId) {
  const res = await apiJSON(`/api/notes/${noteId}/bookmarks`, "DELETE", { id: bookmarkId });
  return parseJsonResponse(res);
}

export async function getAnnotations(noteId) {
  const res = await apiJSON(`/api/notes/${noteId}/annotations`, "GET");
  return parseJsonResponse(res);
}

export async function addAnnotation(noteId, payload) {
  const res = await apiJSON(`/api/notes/${noteId}/annotations`, "POST", payload);
  return parseJsonResponse(res);
}

export async function getLastPage(noteId) {
  const res = await apiJSON(`/api/notes/${noteId}/lastpage`, "GET");
  return parseJsonResponse(res);
}

export async function saveLastPage(noteId, page) {
  const res = await apiJSON(`/api/notes/${noteId}/lastpage`, "POST", { page });
  return parseJsonResponse(res);
}

export function searchNotes(query) {
  return fetch(`${API}/notes/search?q=${encodeURIComponent(query)}`);
}