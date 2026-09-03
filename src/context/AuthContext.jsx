import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("tokens");

    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }

    setCheckingSession(false);
  }, []);

  function login(userData, tokenData) {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokenData));
  }

  function logout() {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  }

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, tokens, isLoggedIn, checkingSession, login, logout }}
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
