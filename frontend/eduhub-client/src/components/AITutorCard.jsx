import React, { useState, useRef, useEffect } from "react";
import { askAI } from "../api/ai";

export default function AITutorCard() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your study assistant. How can I help today? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input.trim();

    // Add user message
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await askAI(userText);

      setMessages(prev => [
        ...prev,
        { role: "ai", text: res.reply || "No response received." }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "⚠️ I encountered an error. Try again later." }
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-[380px] flex flex-col">

      <h2 className="text-xl font-semibold mb-3">AI Study Tutor</h2>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              m.role === "user"
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 text-sm animate-pulse">AI is typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Ask me anything about your lessons..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ➤
        </button>
      </div>

    </div>
  );
}
