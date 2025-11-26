import React from "react";

export default function DeleteModal({ onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-80 p-6 rounded-xl shadow-xl text-center">

                <h2 className="text-xl font-semibold mb-2 text-red-600">
                    Are you sure?
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                    You are about to delete this note permanently.
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
