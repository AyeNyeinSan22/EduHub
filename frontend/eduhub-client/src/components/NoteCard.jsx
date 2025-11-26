import { FaTrash } from "react-icons/fa";
import { IoHeadset } from "react-icons/io5";

export default function NotesCard({ note, onRead, onEdit, onDelete }) {
  return (
    <div className="w-[260px] p-4 bg-white rounded-xl shadow-md flex">
      {/* COVER IMAGE */}
      <div className="w-[110px] h-[150px] bg-gray-300 flex justify-center items-center rounded">
        {note.cover_path ? (
          <img
            src={`http://localhost:5000/${note.cover_path}`}
            alt="cover"
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-gray-700 font-semibold">Cover</span>
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="ml-4 flex flex-col justify-between py-1">
        
        {/* TITLE */}
        <div>
          <p className="text-[14px] font-semibold">Title</p>
          <p className="text-[12px] text-gray-600 w-[120px]">
            {note.title}
          </p>

          <p className="text-[14px] font-semibold mt-2">Notes</p>
          <p className="text-[12px] text-gray-600 w-[120px] leading-tight">
            {note.subject}
            <br />
            {note.category}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="mt-2">
          {/* READ BUTTON */}
          <button
            onClick={onRead}
            className="w-full border border-[#FF6D5A] text-[#FF6D5A] rounded-lg h-[32px] flex justify-center items-center gap-2 mb-2"
          >
            Read
            <IoHeadset size={16} />
          </button>

          {/* EDIT + DELETE */}
          <div className="w-full flex">
            <button
              onClick={onEdit}
              className="flex-1 h-[32px] border border-gray-300 rounded-l-lg text-gray-700"
            >
              Edit
            </button>

            <button
              onClick={onDelete}
              className="w-[38px] h-[32px] bg-[#FF6D5A] rounded-r-lg flex justify-center items-center text-white"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
