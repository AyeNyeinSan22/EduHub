import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // LOAD EXISTING NOTE
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/notes/${id}`, { timeout: 4000 })
      .then(res => {
        const n = res.data;

        setSubject(n.subject);
        setTitle(n.title);
        setCategory(n.category);
        setNotes(n.notes);

        // fallback
        if (n.cover_url) {
          setCoverPreview(n.cover_url);
        }

        setLoading(false); // 🔥 FIXED
      })
      .catch(err => {
        console.error("Failed to load note:", err);
        setLoading(false); // 🔥 FIXED
      });
  }, [id]);

  // PREVIEW NEW COVER
  const handleCoverChange = (e) => {
    const c = e.target.files[0];
    setCover(c);
    if (c) setCoverPreview(URL.createObjectURL(c));
  };

  // UPDATE NOTE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("notes", notes);

    if (file) formData.append("file", file);
    if (cover) formData.append("cover", cover);

    try {
      await axios.put(
        `http://127.0.0.1:5000/api/notes/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSaving(false);
      alert("Note updated successfully!");
      navigate("/mynotes");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-center text-xl font-semibold mb-10">
        Edit Book Details
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm space-y-6">

        {/* SUBJECT + CATEGORY */}
        <div className="flex gap-4">
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Subject Name"
            className="flex-1 border rounded-lg p-3"
            required
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
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

        {/* TITLE */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border rounded-lg p-3"
          required
        />

        {/* FILE UPLOAD */}
        <div className="border rounded-lg p-3 flex justify-between items-center">
          <span>Replace File (optional)</span>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
        </div>

        {/* COVER UPLOAD */}
        <div className="border rounded-lg p-3">
          <label className="block mb-2 font-medium">Replace Cover (optional)</label>

          <input type="file" accept="image/*" onChange={handleCoverChange} />

          {coverPreview && (
            <img
              src={coverPreview}
              onError={e => (e.target.src = "/default-cover.png")}
              className="mt-4 w-40 h-52 object-cover rounded border"
              alt="cover preview"
            />
          )}
        </div>

        {/* NOTES */}
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes..."
          className="w-full border rounded-lg p-3 h-24"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className={`w-full text-white font-semibold rounded-lg py-3 text-lg
            ${saving ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}
          `}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}
