// src/api/notes.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
const client = axios.create({ baseURL: BASE_URL });

export async function createNote(formData, onUploadProgress) {
  const res = await client.post("/api/notes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return res.data;
}

export async function listNotes() {
  const res = await client.get("/api/notes");
  return res.data;
}

export async function updateNote(id, formData) {
  const res = await client.put(`/api/notes/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteNote(id) {
  const res = await client.delete(`/api/notes/${id}`);
  return res.data;
}
