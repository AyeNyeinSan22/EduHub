import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddNote() {
  const navigate = useNavigate();

  // form states
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // Handle cover preview
  const handleCoverChange = (e) => {
    const c = e.target.files[0];
    setCover(c);

    if (c) {
      setCoverPreview(URL.createObjectURL(c));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !title || !category) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("notes", notes);

    if (file) formData.append("file", file);
    if (cover) formData.append("cover", cover);

    try {
      await axios.post("http://127.0.0.1:5000/api/notes", formData);

      alert("Note created successfully!");

      // clear form
      setSubject("");
      setTitle("");
      setCategory("");
      setNotes("");
      setFile(null);
      setCover(null);
      setCoverPreview(null);

      navigate("/mynotes");

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }

    setLoading(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-center text-xl font-semibold mb-10">
        Fill up Book Details
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm space-y-6"
      >

        {/* Subject & Category */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Subject Name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 border rounded-lg p-3"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-52 border rounded-lg p-3"
            required
          >
            <option value="">Category</option>
            <option value="E-Book">E-Book</option>
            <option value="Notes">Notes</option>
            <option value="Audio">Audio</option>
            <option value="Journal">Journal</option>
          </select>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        {/* File Upload */}
        <div className="border rounded-lg p-3 flex items-center justify-between">
          <span className="text-gray-700">Upload PDF / Document</span>

          <input
            type="file"
            className="w-40"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Cover Upload */}
        <div className="border rounded-lg p-3">
          <label className="block mb-2 font-medium text-gray-700">
            Upload Note Cover
          </label>

          <input type="file" accept="image/*" onChange={handleCoverChange} />

          {coverPreview && (
            <img
              src={coverPreview}
              className="mt-4 w-40 h-52 object-cover rounded border"
              alt="Cover Preview"
            />
          )}
        </div>

        {/* Notes Field */}
        <textarea
          placeholder="Notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded-lg p-3 h-24"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white font-semibold rounded-lg py-3 text-lg hover:bg-orange-600 transition"
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
