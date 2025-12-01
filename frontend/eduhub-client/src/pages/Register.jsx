import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  Register page — Figma-like
  Submits JSON to /api/auth/register
*/

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setBusy(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || data.error || "Register failed");
        setBusy(false);
        return;
      }

      alert("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Network error", err);
      alert("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <img src="/logo192.png" alt="logo" className="mx-auto w-16 h-16" />
          <h1 className="text-2xl font-semibold mt-4 text-orange-600">Create account</h1>
          <p className="text-gray-500 mt-2">For both staff & students</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">College email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="you@college.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {busy ? "Registering..." : "Register"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already a user?{" "}
            <a className="text-orange-600 hover:underline" href="/login">
              Login now
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
