"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [authData, setAuthData] = useState<{
    user: User | null;
    token: string | null;
    isLoading: boolean;
  }>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Effet pour gérer le montage du composant
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effet pour charger les données d'authentification
  useEffect(() => {
    if (!mounted) return;

    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === "object") {
          setAuthData({
            user: parsedUser,
            token: storedToken,
            isLoading: false,
          });
          return;
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setAuthData((prev) => ({ ...prev, isLoading: false }));
  }, [mounted]);

  const login = (newToken: string, user: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthData({
      token: newToken,
      user,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthData({
      token: null,
      user: null,
      isLoading: false,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user: authData.user,
        token: authData.token,
        login,
        logout,
        isLoading: authData.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
