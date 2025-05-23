"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User, AuthResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (response: AuthResponse) => void;
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
  const [state, setState] = useState<{
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
          setState({
            user: parsedUser,
            token: storedToken,
            isLoading: false,
          });
          return;
        }
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [mounted]);
  const login = (response: AuthResponse) => {
    const user: User = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    };
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(user));
    setState({
      token: response.token,
      user,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState({
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
        user: state.user,
        token: state.token,
        login,
        logout,
        isLoading: state.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
