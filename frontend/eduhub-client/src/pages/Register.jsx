import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError("User already exists.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 p-10">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg text-center">

        <h1 className="text-4xl font-bold text-orange-500 mb-4">UniHub</h1>
        <p className="text-gray-600 mb-8">For Both Staff & Students</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="username@batstate-u.edu.ph"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 text-white py-3 rounded-lg">
            Register
          </button>
        </form>

        <p className="mt-6 text-sm">
          Already a user?{" "}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login now
          </span>
        </p>
      </div>
    </div>
  );
}
