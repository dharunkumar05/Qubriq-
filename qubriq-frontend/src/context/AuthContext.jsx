import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  const refresh = async () => {
    try {
      const nextUser = await authService.getMe();

      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "anonymous");
    } catch {
      setUser(null);
      setStatus("anonymous");
    }
  };

  useEffect(() => {
    refresh();

    const handleUnauthorized = () => {
      setUser(null);
      setStatus("expired");
    };

    window.addEventListener("qubriq:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener(
        "qubriq:unauthorized",
        handleUnauthorized,
      );
    };
  }, []);

  const login = async (payload) => {
    const result = await authService.login(payload);
    const nextUser = result?.user || result;

    setUser(nextUser);
    setStatus("authenticated");

    return nextUser;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setStatus("anonymous");
    }
  };

  const value = {
    status,
    user,
    login,
    logout,
    refresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
