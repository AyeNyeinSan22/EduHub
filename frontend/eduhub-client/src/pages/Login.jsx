import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { ok, data } = await loginUser(email, password);

    if (!ok) {
      setError(data.msg || "Invalid email or password");
      setLoading(false);
      return;
    }

    // Save token + user in AuthProvider
    login({ token: data.token, user: data.user });

    navigate("/home");
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#ff6e4e] bg-gradient-to-br from-[#ff6e4e] to-[#fe9276]">
      <div className="bg-white w-[420px] rounded-2xl shadow-lg px-10 py-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          {/* <img
            src="./logo.png"
            alt="logo"
            className="w-16 h-16 mb-2"
          /> */}
          <h1 className="text-3xl font-semibold text-[#FF6E4E]">UniHub</h1>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-1">Welcome Back !</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Sign in to continue your Journey
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-[#FF6E4E]"
              placeholder="username@batstate-u.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className="w-full border rounded-lg px-4 py-2 focus:outline-[#FF6E4E]"
                placeholder="●●●●●●●●"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Show/Hide Password */}
              <span
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPw ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#FF6E4E]" />
              Remember me
            </label>

            <button type="button" className="text-[#FF6E4E] hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6E4E] hover:bg-[#ff835f] text-white py-2 rounded-lg text-lg shadow transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Bottom links */}
        <div className="text-center mt-6 text-sm">
          New User?{" "}
          <Link to="/register" className="text-[#FF6E4E] hover:underline">
            Register Here
          </Link>
        </div>

        <div className="text-center mt-2 text-sm">
          <button className="text-gray-500 hover:underline">
            Use as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
