export default function DeleteModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-8 w-96 shadow-xl animate-fadeIn">

        {/* ICON */}
        <div className="text-center text-5xl mb-3">⚠️</div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-bold mb-2">
          Delete Note?
        </h2>

        {/* MESSAGE */}
        <p className="text-center text-gray-600 mb-6">
          The note will be permanently deleted. Are you sure you want to delete this note?
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}
