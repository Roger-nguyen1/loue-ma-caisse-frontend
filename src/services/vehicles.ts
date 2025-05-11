import { Vehicle, TransmissionType, FuelType } from "@/types";
import axios, { AxiosError } from "axios";
import { apiService } from "./api";
import toast from "react-hot-toast";

export interface VehicleFilters {
  city?: string;
  maxPrice?: number;
  transmission?: TransmissionType;
  fuelType?: FuelType;
  isElectric?: boolean;
}

export async function searchVehicles(filters: VehicleFilters) {
  try {
    const vehicles = await apiService.vehicles.getAll();
    return vehicles.filter((vehicle) => {
      if (filters.city && vehicle.city !== filters.city) return false;
      if (filters.maxPrice && vehicle.pricePerDay > filters.maxPrice)
        return false;
      if (filters.transmission && vehicle.transmission !== filters.transmission)
        return false;
      if (filters.fuelType && vehicle.fuelType !== filters.fuelType)
        return false;
      if (
        filters.isElectric !== undefined &&
        vehicle.isElectric !== filters.isElectric
      )
        return false;
      return true;
    });
  } catch (error) {
    handleApiError(error);
    return [];
  }
}

export async function getVehicleDetails(id: string): Promise<Vehicle | null> {
  try {
    const vehicle = await apiService.vehicles.getById(id);
    return vehicle;
  } catch (error) {
    handleApiError(error);
    return null;
  }
}

function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;

    if (axiosError.response?.status === 404) {
      toast.error("Véhicule non trouvé");
    } else if (axiosError.response?.status === 401) {
      toast.error("Vous devez être connecté pour effectuer cette action");
    } else if (axiosError.response?.status === 403) {
      toast.error("Vous n'avez pas les droits nécessaires");
    } else if (axiosError.response?.data?.message) {
      toast.error(axiosError.response.data.message);
    } else {
      toast.error("Une erreur est survenue");
    }
  } else {
    toast.error("Une erreur inattendue est survenue");
  }
  console.error("API Error:", error);
}
