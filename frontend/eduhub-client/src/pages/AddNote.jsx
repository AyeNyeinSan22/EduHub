import { useState } from "react";
import axios from "../api/axios";
import FileInput from "../components/FileInput";
import { useNavigate } from "react-router-dom";

export default function AddNote() {
    const navigate = useNavigate();

    // Form States
    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("E-Book");
    const [notesText, setNotesText] = useState("");

    // File States
    const [file, setFile] = useState(null);
    const [cover, setCover] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!subject || !title || !category || !notesText || !file) {
            alert("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("title", title);
        formData.append("category", category);
        formData.append("notes", notesText);

        if (file) formData.append("file", file);
        if (cover) formData.append("cover", cover);

        try {
            await axios.post("/notes", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Note added successfully!");
            navigate("/mynotes");

        } catch (error) {
            console.error(error);
            alert("Upload failed.");
        }
    };

    return (
        <div className="p-6 w-full">
            <div className="bg-white shadow rounded-lg p-10">
                <h2 className="text-xl font-semibold mb-8">Fill up Book Details</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Subject Input */}
                    <input
                        type="text"
                        placeholder="Subject Name"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="border p-3 rounded w-full"
                    />

                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-3 rounded w-full"
                    />

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-3 rounded w-full"
                    >
                        <option value="E-Book">E-Book</option>
                        <option value="Audio-Book">Audio Book</option>
                        <option value="Articles">Articles</option>
                        <option value="Favorite">Favorite</option>
                    </select>

                    {/* File Upload */}
                    <FileInput
                        label="Select File"
                        name="file"
                        valueFile={file}
                        onChange={setFile}
                        accept=".pdf,.doc,.docx,.pptx"
                    />

                    {/* Cover Upload */}
                    <FileInput
                        label="Upload Note Cover"
                        name="cover"
                        valueFile={cover}
                        onChange={setCover}
                        accept="image/*"
                    />

                    {/* Notes Text */}
                    <textarea
                        placeholder="Notes..."
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        className="border p-3 rounded w-full h-24"
                    ></textarea>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-orange-500 text-white px-6 py-3 rounded w-full hover:bg-orange-600 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
