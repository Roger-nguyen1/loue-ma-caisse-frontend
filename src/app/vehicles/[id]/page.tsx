"use client";

import { useEffect, useState } from "react";
import { Vehicle } from "@/types";
import { apiService } from "@/services/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await apiService.vehicles.getById(params.id);
        setVehicle(data);
      } catch (error) {
        console.error("Erreur lors du chargement du véhicule:", error);
        toast.error("Ce véhicule n'existe pas ou n'est plus disponible");
        router.push("/vehicles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id, router]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vous devez être connecté pour réserver un véhicule");
      router.push("/login");
      return;
    }

    const { startDate, endDate } = bookingDates;
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les dates de location");
      return;
    }

    try {
      const booking = await apiService.bookings.create({
        vehicleId: params.id,
        startDate,
        endDate,
      });

      toast.success("Réservation effectuée avec succès !");
      router.push(`/bookings/${booking.id}`);
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la réservation");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <Image
              src={vehicle.imageUrl || "/images/default-car.jpg"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">
              {vehicle.brand} {vehicle.model}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Informations</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-gray-600 w-24">Année :</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-600 w-24">Prix :</span>
                    <span className="font-medium text-primary-600">
                      {vehicle.pricePerDay}€ / jour
                    </span>
                  </li>
                </ul>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Réservation</h2>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={bookingDates.startDate}
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          startDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={bookingDates.endDate}
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          endDate: e.target.value,
                        })
                      }
                      min={
                        bookingDates.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Réserver maintenant
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
