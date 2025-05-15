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

// Type pour les searchParams une fois résolus
type ResolvedSearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  params: Promise<PageParams>;
  // Modifié pour correspondre au type attendu par Next.js selon l'erreur
  searchParams: Promise<ResolvedSearchParams>;
}

export default function BookingConfirmationPage(props: PageProps) {
  // Déstructurer paramsPromise et searchParamsPromise depuis props
  const { params: paramsPromise, searchParams: searchParamsPromise } = props;

  // Résoudre les promesses en utilisant le hook 'use'
  // Si paramsPromise est de type Promise<PageParams>, 'params' sera de type PageParams
  const params = use(paramsPromise);
  // Si searchParamsPromise est de type Promise<ResolvedSearchParams>, 'searchParams' sera de type ResolvedSearchParams
  // Même si searchParams n'est pas utilisé activement dans votre logique actuelle,
  // il faut le résoudre pour satisfaire la signature de type et le hook 'use'.
  const searchParams = use(searchParamsPromise);
  // Si vous ne prévoyez pas d'utiliser searchParams, vous pouvez le nommer avec un underscore:
  // const _searchParams = use(searchParamsPromise);

  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingAndVehicle = async () => {
      // 'params.id' est disponible ici car 'params' est la valeur résolue de la promesse
      if (!params || !params.id) {
        console.error("ID de réservation manquant dans les paramètres.");
        toast.error("ID de réservation manquant.");
        router.push("/bookings");
        setIsLoading(false); // Assurez-vous de gérer l'état de chargement
        return;
      }
      try {
        const bookingData = await apiService.bookings.getById(params.id);
        setBooking(bookingData);

        if (bookingData && bookingData.vehicleId) {
          const vehicleData = await apiService.vehicles.getById(
            bookingData.vehicleId
          );
          setVehicle(vehicleData);
        } else {
          // Gérer le cas où bookingData est null ou vehicleId est manquant
          console.error(
            "Données de réservation incomplètes ou vehicleId manquant après récupération."
          );
          toast.error("Détails de la réservation incomplets.");
          // Vous pourriez vouloir rediriger ou afficher un message d'erreur plus spécifique ici
          // Pour l'instant, on arrête le chargement et on ne définit pas de véhicule
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la réservation:", error);
        toast.error("Impossible de charger les détails de la réservation");
        router.push("/bookings");
      } finally {
        setIsLoading(false);
      }
    };

    // 'params' est résolu avant que useEffect ne s'exécute grâce au hook 'use'
    // donc nous pouvons l'utiliser directement comme dépendance.
    fetchBookingAndVehicle();
  }, [params, router]); // Utiliser params (l'objet résolu) comme dépendance.
  // Si seul params.id est utilisé, [params.id, router] est aussi correct et plus précis.

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

  // Si le chargement est terminé mais que la réservation ou le véhicule n'a pas pu être chargé
  if (!booking || !vehicle) {
    // Vous pourriez vouloir afficher un message d'erreur plus informatif ici
    // au lieu de simplement retourner null, qui ne rendra rien.
    // Par exemple, si la redirection a déjà eu lieu dans useEffect, ce return pourrait ne pas être atteint.
    // Si la redirection n'a pas eu lieu mais les données sont manquantes, affichez un message.
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">
          Impossible d'afficher les détails de la réservation.
        </p>
        <button
          onClick={() => router.push("/bookings")}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md transition-colors"
        >
          Retourner à mes réservations
        </button>
      </div>
    );
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
          <div className="bg-primary-600 text-white p-6">
            {" "}
            {/* Changé text-gray-600 en text-white pour un meilleur contraste sur fond primary-600 */}
            <div className="flex items-center gap-4">
              {" "}
              {/* Augmenté le gap pour une meilleure séparation */}
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.status)}
                <span className="font-medium">
                  {" "}
                  {/* Enlevé text-gray-600, héritera de text-white */}
                  {getStatusText(booking.status)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Détails de la réservation
                </h1>
                <p className="text-primary-100">
                  {" "}
                  {/* text-primary-100 est ok si c'est une nuance claire de la couleur primaire */}
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Ajout de l'attribut sizes pour l'optimisation de l'image
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
                Informations de la réservation{" "}
                {/* Changé "Détails" en "Informations" pour varier */}
              </h3>

              <dl className="grid grid-cols-1 gap-y-4">
                {" "}
                {/* Changé gap-4 en gap-y-4 pour espacement vertical uniquement */}
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

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              {" "}
              {/* Responsive flex direction */}
              <button
                onClick={() => router.push("/bookings")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md transition-colors w-full sm:w-auto"
              >
                Voir mes réservations
              </button>
              <button
                onClick={() => router.push("/vehicles")}
                className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors w-full sm:w-auto"
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
