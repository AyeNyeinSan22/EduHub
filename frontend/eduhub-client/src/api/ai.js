// src/api/ai.js
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/ai";

// ---- AI SUMMARY ONLY ----
export async function summarizePDF(payload) {
  try {
    const res = await axios.post(`${API_URL}/summary`, payload, {
      timeout: 120000, // 2 min for long PDFs
    });
    return res.data;
  } catch (err) {
    console.error("AI SUMMARY ERROR:", err);
    throw err;
  }
}
