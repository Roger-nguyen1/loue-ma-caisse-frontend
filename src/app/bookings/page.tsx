"use client";

import { useEffect, useState } from "react";
import { Booking, Vehicle } from "@/types";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const bookingsData = await apiService.bookings.getUserBookings();
        setBookings(bookingsData);

        // Récupérer les détails des véhicules pour chaque réservation
        const vehiclesMap: Record<string, Vehicle> = {};
        await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const vehicleData = await apiService.vehicles.getById(
                booking.vehicleId
              );
              vehiclesMap[booking.vehicleId] = vehicleData;
            } catch (error) {
              console.error(
                `Erreur lors du chargement du véhicule ${booking.vehicleId}:`,
                error
              );
            }
          })
        );
        setVehicles(vehiclesMap);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error);
        toast.error("Impossible de charger vos réservations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookings();
  }, [user, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "Pending":
        return <ArrowPathIcon className="h-6 w-6 text-yellow-500" />;
      case "Cancelled":
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "Confirmée";
      case "Pending":
        return "En attente";
      case "Cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de réservation
          </p>
          <button
            onClick={() => router.push("/vehicles")}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Chercher un véhicule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const vehicle = vehicles[booking.vehicleId];
            if (!vehicle) return null;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className="font-medium">
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Réservation #{booking.id.slice(-6)}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={vehicle.imageUrl || "/images/default-car.jpg"}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold mb-2">
                        {vehicle.brand} {vehicle.model}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">
                            Du{" "}
                            {format(
                              new Date(booking.startDate),
                              "d MMMM yyyy",
                              { locale: fr }
                            )}
                          </p>
                          <p className="text-gray-600">
                            Au{" "}
                            {format(new Date(booking.endDate), "d MMMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-600">
                            {booking.totalPrice}€
                          </p>
                          <p className="text-sm text-gray-500">
                            {vehicle.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.status === "Pending" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                        className="text-primary-600 hover:text-primary-700 hover:underline hover:cursor-pointer font-medium"
                      >
                        Voir les détails
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
