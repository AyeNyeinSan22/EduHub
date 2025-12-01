import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiBookOpen, FiBook } from "react-icons/fi";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md p-6 flex flex-col">

      {/* LOGO */}
      <h1 className="text-3xl font-bold text-orange-500 mb-10">UniHub</h1>

      {/* MENU */}
      <nav className="space-y-6 text-gray-700">

        <Link to="/" className="flex items-center gap-3 hover:text-orange-500">
          <FiHome size={20} /> Home
        </Link>

        <Link to="/search" className="flex items-center gap-3 hover:text-orange-500">
          <FiSearch size={20} /> Search
        </Link>

        <Link to="/mynotes" className="flex items-center gap-3 hover:text-orange-500">
          <FiBookOpen size={20} /> My Notes
        </Link>

        <Link to="/study" className="flex items-center gap-3 hover:text-orange-500">
          <FiBook size={20} /> Study Area
        </Link>

      </nav>

      {/* FOOTER */}
      <div className="mt-auto text-sm text-gray-400 pt-10">
        <p>About</p>
        <p>Support</p>
        <p>Terms & Conditions</p>
      </div>

    </div>
  );
}
