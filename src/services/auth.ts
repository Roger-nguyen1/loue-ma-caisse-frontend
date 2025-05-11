import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";
import axios, { AxiosError } from "axios";
import { apiService } from "./api";
import toast from "react-hot-toast";

export async function login(data: LoginRequest): Promise<AuthResponse | null> {
  try {
    const response = await apiService.auth.login(data);
    toast.success("Connexion réussie !");
    return response;
  } catch (error) {
    handleAuthError(error, "login");
    return null;
  }
}

export async function register(
  data: RegisterRequest
): Promise<AuthResponse | null> {
  try {
    const response = await apiService.auth.register(data);
    toast.success("Inscription réussie !");
    return response;
  } catch (error) {
    handleAuthError(error, "register");
    return null;
  }
}

function handleAuthError(error: unknown, action: "login" | "register") {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;

    if (axiosError.response?.status === 400) {
      const message = axiosError.response.data.message;
      if (action === "login") {
        toast.error("Email ou mot de passe incorrect");
      } else if (message?.includes("existe déjà")) {
        toast.error("Un compte avec cet email existe déjà");
      } else {
        toast.error(message || "Veuillez vérifier vos informations");
      }
    } else if (axiosError.response?.status === 429) {
      toast.error("Trop de tentatives, veuillez réessayer plus tard");
    } else {
      toast.error(
        action === "login"
          ? "Erreur lors de la connexion"
          : "Erreur lors de l'inscription"
      );
    }
  } else {
    toast.error("Une erreur inattendue est survenue");
  }
  console.error("Auth Error:", error);
}
