// src/pages/MyNotes.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NotesCard from "../components/NotesCard";
import DeleteModal from "../components/DeleteModal";

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const navigate = useNavigate();

  // Load notes from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/notes")
      .then((res) => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load notes:", err);
        setLoading(false);
      });
  }, []);

  // Ask before deletion
  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/notes/${deleteId}`);
      setNotes((prev) => prev.filter((n) => n.id !== deleteId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setConfirmDeleteOpen(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading notes…</p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Shelf</h1>

        <Link
          to="/notes/new"
          className="bg-orange-500 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2"
        >
          ➕ New
        </Link>
      </div>

      {/* Tabs (UI only) */}
      <div className="flex gap-10 mb-6 text-gray-600">
        <span className="font-semibold text-orange-600">All Books</span>
        <span>Favourite</span>
        <span>E-Books</span>
        <span>Audio Books</span>
        <span>Articles & Journals</span>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center w-full col-span-4">
            No notes found.
          </p>
        ) : (
          notes.map((note) => (
            <NotesCard
              key={note.id}
              note={note}
              onRead={() => navigate(`/notes/read/${note.id}`)}
              onEdit={() => navigate(`/notes/edit/${note.id}`)}
              onDelete={() => handleDelete(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
