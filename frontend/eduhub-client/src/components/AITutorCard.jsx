// import React, { useState } from "react";
// import axios from "axios";

// export default function AiTutorCard() {
//   const [input, setInput] = useState("");
//   const [reply, setReply] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function askTutor() {
//     if (!input.trim()) return;
//     setLoading(true);
//     setReply("");

//     try {
//       const res = await axios.post("http://127.0.0.1:5000/api/ai/tutor", {
//         question: input,
//       });

//       setReply(res.data.reply || "No reply.");
//     } catch (e) {
//       setReply("⚠️ Tutor error.");
//     }

//     setLoading(false);
//   }

//   return (
//     <div className="bg-white p-6 rounded-xl h-full shadow-md flex flex-col">
//       <h2 className="text-lg font-bold mb-3">AI Study Tutor</h2>

//       <textarea
//         className="border p-2 rounded w-full h-24"
//         placeholder="Ask anything…"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button
//         onClick={askTutor}
//         className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
//       >
//         {loading ? "Thinking…" : "Ask Tutor"}
//       </button>

//       <div className="mt-4 p-3 bg-gray-50 rounded h-40 overflow-auto whitespace-pre-wrap">
//         {loading ? "⏳ Processing…" : reply || "Ask something to begin."}
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AiTutorCard() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("Ask something to begin.");
  const [loading, setLoading] = useState(false);

  async function askTutor() {
    if (!input.trim()) return;
    setLoading(true);
    setReply("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/ai/tutor", {
        question: input,
      });

      setReply(res.data.reply || "No reply.");
    } catch (e) {
      setReply("⚠️ Tutor error.");
    }

    setLoading(false);
    setInput("");
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm h-full p-6 rounded-2xl shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">AI Study Tutor</h2>

        <button
          onClick={() => setReply("Ask something to begin.")}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg"
        >
          Clear
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-4 shadow-inner border border-gray-100">
        {loading ? (
          <div className="animate-pulse">
            <div className="w-40 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-56 h-4 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <motion.div
            key={reply}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-3 rounded-xl shadow text-gray-700 whitespace-pre-wrap"
          >
            {reply}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your lessons…"
          className="w-full h-24 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
        />

        <button
          onClick={askTutor}
          className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
        >
          {loading ? "Thinking…" : "Ask Tutor"}
        </button>
      </div>
    </div>
  );
}
