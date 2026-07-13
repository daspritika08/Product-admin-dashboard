import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  initials: string;
  avatarUrl: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "nexus_auth_user";

function deriveUser(email: string): User {
  const parts = email.split("@")[0].split(/[._-]/);
  const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  const initials = parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
  const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
  return { email, name, initials, avatarUrl };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    // Simulate a short network delay for realism
    await new Promise((r) => setTimeout(r, 700));

    if (!email.trim()) return { success: false, error: "Email is required." };
    if (!email.includes("@")) return { success: false, error: "Enter a valid email address." };
    if (!password.trim()) return { success: false, error: "Password is required." };
    if (password.length < 4) return { success: false, error: "Password must be at least 4 characters." };

    const derived = deriveUser(email.trim().toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(derived));
    setUser(derived);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: user !== null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
