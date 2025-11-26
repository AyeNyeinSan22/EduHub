import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-[#F7F7FB]">

      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white shadow-sm border-r px-6 py-4">
        <h1 className="text-3xl font-bold text-red-500 mb-10">UniHub</h1>

        <nav className="space-y-6">
          <a href="/" className="text-gray-700 flex items-center gap-3">🏠 Home</a>
          <a href="/mynotes" className="text-gray-700 flex items-center gap-3">📚 My Notes</a>
        </nav>

        <div className="absolute bottom-10 text-sm text-gray-500">
          <p>About</p>
          <p>Support</p>
          <p>Terms & Condition</p>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1">
        {/* Topbar stays same across pages */}
        <div className="h-20 border-b bg-white flex items-center px-6">
          <input
            type="text"
            placeholder="Search…"
            className="w-96 border p-2 rounded"
          />
        </div>

        {/* <-- This is where Home or MyNotes will load */}
        <div className="p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
