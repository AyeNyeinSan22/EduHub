// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchProfile as apiFetchProfile } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    // if token available but no user info, fetch profile
    let mounted = true;
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await apiFetchProfile(token);
        if (!mounted) return;
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err) {
        console.error("fetchProfile failed", err);
        // invalid token -> logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  const login = ({ token: newToken, user: userInfo }) => {
    localStorage.setItem("token", newToken);
    if (userInfo) localStorage.setItem("user", JSON.stringify(userInfo));
    setToken(newToken);
    setUser(userInfo || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
