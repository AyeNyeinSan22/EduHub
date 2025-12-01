import React, { useEffect, useState } from "react";

/*
  Profile page:
  - fetches /api/auth/profile using token in localStorage
  - shows simple editable profile fields (name, email)
  - does NOT change password here (you can extend)
*/

export default function Profile() {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  async function fetchProfile() {
    setBusy(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/api/auth/profile", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        // not logged in / invalid token
        setUser(null);
        setBusy(false);
        return;
      }

      const data = await res.json();
      setUser(data.user || data); // backend may return { user: { ... } }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name: user.name }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated");
        // optionally update localStorage
        localStorage.setItem("user", JSON.stringify(data.user || user));
      } else {
        alert(data.msg || data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (busy) return <div className="p-6 text-center">Loading...</div>;
  if (!user) return <div className="p-6 text-center">Not logged in.</div>;

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Full name</label>
            <input
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="mt-1 w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input value={user.email || ""} readOnly className="mt-1 w-full border rounded-lg p-3 bg-gray-50" />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
