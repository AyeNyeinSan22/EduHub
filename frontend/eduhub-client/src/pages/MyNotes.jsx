import { useEffect, useState } from "react";
import axios from "axios";
import NotesCard from "../components/NoteCard";

export default function MyNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/notes").then(res => {
      setNotes(res.data);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/notes/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  return (
    <div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Shelf</h1>

        <a
          href="/addnote"
          className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2"
        >
          ➕ New
        </a>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-10 mb-6 text-gray-600">
        <span className="font-semibold text-orange-600">All Books</span>
        <span>Favourite</span>
        <span>E-Books</span>
        <span>Audio Books</span>
        <span>Articles & Journals</span>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-3 gap-6">

        {notes.map(note => (
          <NotesCard
              key={note.id}
              note={note}
              onRead={() => console.log("Read", note.id)}
              onEdit={() => console.log("Edit", note.id)}
              onDelete={() => handleDelete(note.id)}
  />
        ))}

      </div>
    </div>
  );
}
