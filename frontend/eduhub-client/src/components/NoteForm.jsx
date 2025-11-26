// src/components/NoteForm.jsx
import React, { useEffect, useState } from "react";
import FileInput from "./FileInput";

export default function NoteForm({ initial = {}, onSubmit, onCancel, submitLabel = "Save" }) {
  const [subject, setSubject] = useState(initial.subject || "");
  const [title, setTitle] = useState(initial.title || "");
  const [category, setCategory] = useState(initial.category || "E-Book");
  const [notes, setNotes] = useState(initial.notes || "");
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);

  useEffect(() => {
    setSubject(initial.subject || "");
    setTitle(initial.title || "");
    setCategory(initial.category || "E-Book");
    setNotes(initial.notes || "");
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("subject", subject);
    fd.append("title", title);
    fd.append("category", category);
    fd.append("notes", notes || "");
    if (file) fd.append("file", file);
    if (cover) fd.append("cover", cover);
    onSubmit(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <input className="col-span-2 border p-3 rounded" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <select className="border p-3 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>E-Book</option>
          <option>Audio-Book</option>
          <option>Favorite</option>
          <option>Journals</option>
        </select>
      </div>

      <input className="w-full border p-3 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="w-full border p-3 rounded" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />

      <div className="grid grid-cols-2 gap-4">
        <FileInput label="Upload file (pdf/docx/pptx/txt)" accept=".pdf,.docx,.pptx,.txt" valueFile={file} onChange={setFile} />
        <FileInput label="Cover image (optional)" accept="image/*" valueFile={cover} onChange={setCover} />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">{submitLabel}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}
