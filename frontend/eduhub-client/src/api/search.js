const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function searchNotes(query) {
  const res = await fetch(`${API}/api/notes/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}
