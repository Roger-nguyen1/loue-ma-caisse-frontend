"use client";

import { useEffect, useState, use } from "react";
import { Booking, Vehicle } from "@/types";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type PageParams = {
  id: string;
};

interface PageProps {
  params: Promise<PageParams>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BookingConfirmationPage(props: PageProps) {
  const { params: paramsPromise } = props;
  const params = use(paramsPromise) as PageParams;
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking || !vehicle) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-600 text-gray-600 p-6">
            {" "}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.status)}
                <span className="text-gray-600 font-medium">
                  {getStatusText(booking.status)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Détails de la réservation
                </h1>
                <p className="text-primary-100">
                  Réservation #{booking.id.slice(-6)}
                </p>
              </div>
            </div>
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
                <p className="text-gray-600">{vehicle.city}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Détails de la réservation
              </h3>

              <dl className="grid grid-cols-1 gap-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date de début :</dt>
                  <dd className="font-medium">
                    {format(new Date(booking.startDate), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date de fin :</dt>
                  <dd className="font-medium">
                    {format(new Date(booking.endDate), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Prix total :</dt>
                  <dd className="font-bold text-primary-600">
                    {booking.totalPrice}€
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => router.push("/bookings")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md transition-colors"
              >
                Voir mes réservations
              </button>
              <button
                onClick={() => router.push("/vehicles")}
                className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
              >
                Chercher d'autres véhicules
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
