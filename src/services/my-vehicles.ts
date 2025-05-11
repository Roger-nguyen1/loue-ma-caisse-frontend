import { Vehicle } from "@/types";
import axios, { AxiosError } from "axios";
import { apiService } from "./api";
import toast from "react-hot-toast";

export async function getMyVehicles(): Promise<Vehicle[]> {
  try {
    const vehicles = await apiService.vehicles.getMyVehicles();
    return vehicles;
  } catch (error) {
    handleVehicleError(error);
    return [];
  }
}

function handleVehicleError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 401) {
      toast.error("Veuillez vous connecter pour accéder à vos véhicules");
    } else {
      toast.error(
        "Une erreur est survenue lors du chargement de vos véhicules"
      );
    }
  } else {
    toast.error("Une erreur inattendue est survenue");
  }
  console.error("Vehicle Error:", error);
}
