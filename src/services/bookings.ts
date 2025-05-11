import { Booking } from "@/types";
import axios, { AxiosError } from "axios";
import { apiService } from "./api";
import toast from "react-hot-toast";

export async function createBooking(data: {
  vehicleId: string;
  startDate: string;
  endDate: string;
}): Promise<Booking | null> {
  try {
    const booking = await apiService.bookings.create(data);
    toast.success("Réservation effectuée avec succès");
    return booking;
  } catch (error) {
    handleBookingError(error);
    return null;
  }
}

export async function getUserBookings(): Promise<Booking[]> {
  try {
    const bookings = await apiService.bookings.getUserBookings();
    return bookings;
  } catch (error) {
    handleBookingError(error);
    return [];
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const booking = await apiService.bookings.getById(id);
    return booking;
  } catch (error) {
    handleBookingError(error);
    return null;
  }
}

function handleBookingError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;

    if (axiosError.response?.status === 400) {
      const message = axiosError.response.data.message;
      if (message?.includes("déjà réservé")) {
        toast.error("Ce véhicule est déjà réservé pour ces dates");
      } else if (message?.includes("disponible")) {
        toast.error("Ce véhicule n'est plus disponible");
      } else {
        toast.error(message || "Erreur lors de la réservation");
      }
    } else if (axiosError.response?.status === 401) {
      toast.error("Veuillez vous connecter pour effectuer une réservation");
    } else if (axiosError.response?.status === 404) {
      toast.error("Réservation introuvable");
    } else {
      toast.error("Une erreur est survenue lors de la réservation");
    }
  } else {
    toast.error("Une erreur inattendue est survenue");
  }
  console.error("Booking Error:", error);
}
