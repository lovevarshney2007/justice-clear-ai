import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("jc_token");
    const savedUser = localStorage.getItem("jc_user");
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login
    await new Promise((r) => setTimeout(r, 1000));
    const mockToken = "mock-jwt-token-" + Date.now();
    const mockUser = { email, name: email.split("@")[0] };
    setToken(mockToken);
    setUser(mockUser);
    localStorage.setItem("jc_token", mockToken);
    localStorage.setItem("jc_user", JSON.stringify(mockUser));
  }, []);

  const register = useCallback(async (email: string, _password: string, name: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    const mockToken = "mock-jwt-token-" + Date.now();
    const mockUser = { email, name };
    setToken(mockToken);
    setUser(mockUser);
    localStorage.setItem("jc_token", mockToken);
    localStorage.setItem("jc_user", JSON.stringify(mockUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jc_token");
    localStorage.removeItem("jc_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
