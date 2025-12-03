// src/api/subjects.js
import axios from "axios";

export async function fetchSubjectOverview() {
  try {
    const res = await axios.get("http://127.0.0.1:5000/api/notes/subjects/overview");
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, data: [] };
  }
}
