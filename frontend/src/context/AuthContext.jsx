import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    }

    loadUser();
  }, []);

  async function login(identifier, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    setUser(data.user);
    return data.user;
  }

  async function signup(formData) {
    const data = await api("/auth/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setUser(data.user);
    return data.user;
  }
  function updateUser(nextUser) {
    setUser(nextUser);
  }

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, checkingSession, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export default AuthContext;
