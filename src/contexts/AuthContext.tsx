import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
// Humari api request function ko import kar rahe hain
import { apiRequest } from "../services/api"; 

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

  // App load hote time localStorage se asli token read karega
  useEffect(() => {
    const saved = localStorage.getItem("jc_token");
    const savedUser = localStorage.getItem("jc_user");
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 🚀 ASLI LOGIN API CALL
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiRequest<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Backend se aane wale data ke hisaab se token aur user nikalein
      // (Agar backend ka structure thoda alag hai, toh aapko response.data check karna padega)
      const actualToken = response.data?.accessToken || response.accessToken; 
      const actualUser = response.data?.user || response.user || { email, name: email.split("@")[0] };

      if (!actualToken) {
         throw new Error("Login failed: No token received from server");
      }

      setToken(actualToken);
      setUser(actualUser);
      localStorage.setItem("jc_token", actualToken);
      localStorage.setItem("jc_user", JSON.stringify(actualUser));
      
    } catch (error) {
      console.error("Real Login Error:", error);
      throw error; // UI ko error dikhane ke liye aage throw karein
    }
  }, []);

  // 🚀 ASLI REGISTER API CALL
  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      // Backend par Signup ki request
      const response = await apiRequest<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName: name }), // Note: Aapke backend mein shyd 'fullName' use ho raha ho
      });

      // Agar signup successful hai, toh automatically login kara dein (Optional)
      // Ya fir hum user ko login page par bhej sakte hain.
      // Abhi ke liye hum token store kar lete hain agar backend bhejta hai:
      const actualToken = response.data?.accessToken || response.accessToken;
      const actualUser = response.data?.user || response.user || { email, name };

      if (actualToken) {
        setToken(actualToken);
        setUser(actualUser);
        localStorage.setItem("jc_token", actualToken);
        localStorage.setItem("jc_user", JSON.stringify(actualUser));
      }
    } catch (error) {
      console.error("Real Register Error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Agar backend par `/auth/logout` call karni hai toh yahan kar sakte hain
    // apiRequest("/auth/logout", { method: "POST" }).catch(console.error);
    
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