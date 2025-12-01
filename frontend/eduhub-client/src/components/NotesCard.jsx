import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function NotesCard({ note, onRead, onEdit, onDelete }) {
  
  if (!note) return null; // <-- FIX: Prevent crash!

  const coverURL = note.cover_url || "/default-cover.png";

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition relative">

      <img
        src={coverURL}
        alt="Note Cover"
        className="w-full h-48 object-cover rounded-xl border"
      />

      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-black"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <HiOutlineDotsVertical size={22} />
      </button>

      {menuOpen && (
        <div className="absolute top-10 right-4 bg-white shadow-lg rounded-lg border w-32 z-10">
          <button onClick={onRead} className="block w-full text-left px-4 py-2 hover:bg-gray-100">📖 Read</button>
          <button onClick={onEdit} className="block w-full text-left px-4 py-2 hover:bg-gray-100">✏ Edit</button>
          <button onClick={onDelete} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">🗑 Delete</button>
        </div>
      )}

      <h2 className="text-lg font-bold mt-4 text-gray-900">
        {note.title}
      </h2>

      <span className="inline-block mt-1 px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-600 font-semibold">
        {note.category}
      </span>

      <p className="mt-3 text-gray-600 text-sm line-clamp-3 whitespace-pre-line">
        {note.notes}
      </p>

      <div className="flex gap-2 mt-4">
        <button onClick={onRead} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600">
          Read 🎧
        </button>
        <button onClick={onEdit} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
          ✏
        </button>
        <button onClick={onDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
          🗑
        </button>
      </div>

    </div>
  );
}
