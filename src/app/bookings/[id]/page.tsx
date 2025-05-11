"use client";

import { useEffect, useState } from "react";
import { Booking, Vehicle } from "@/types";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

export default function BookingConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingAndVehicle = async () => {
      try {
        const bookingData = await apiService.bookings.getById(params.id);
        setBooking(bookingData);

        const vehicleData = await apiService.vehicles.getById(
          bookingData.vehicleId
        );
        setVehicle(vehicleData);
      } catch (error) {
        console.error("Erreur lors du chargement de la réservation:", error);
        toast.error("Impossible de charger les détails de la réservation");
        router.push("/bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingAndVehicle();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking || !vehicle) {
    return null;
  }

  const startDate = new Date(booking.startDate).toLocaleDateString("fr-FR");
  const endDate = new Date(booking.endDate).toLocaleDateString("fr-FR");

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-600 text-white p-6">
            <h1 className="text-2xl font-bold">Confirmation de réservation</h1>
            <p className="text-primary-100">
              Réservation #{booking.id.slice(-6)}
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={vehicle.imageUrl || "/images/default-car.jpg"}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <p className="text-gray-600">Année : {vehicle.year}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Détails de la réservation
              </h3>

              <dl className="grid grid-cols-1 gap-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date de début :</dt>
                  <dd className="font-medium">{startDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date de fin :</dt>
                  <dd className="font-medium">{endDate}</dd>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <dt className="text-gray-900 font-semibold">Prix total :</dt>
                  <dd className="text-primary-600 font-bold text-xl">
                    {booking.totalPrice}€
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-gray-600 text-sm">
                Un email de confirmation vous a été envoyé avec tous les détails
                de votre réservation.
              </p>
              <button
                onClick={() => router.push("/bookings")}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
              >
                Voir mes réservations
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
