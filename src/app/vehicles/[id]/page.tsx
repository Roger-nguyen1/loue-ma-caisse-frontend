"use client";

import { useEffect, useState, use } from "react";
import { Vehicle } from "@/types";
import { apiService } from "@/services/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import DatePicker from "@/components/ui/custom/DatePicker"; // Assurez-vous que ce chemin est correct

type PageParams = {
  id: string;
};

// Type pour les searchParams une fois résolus
type ResolvedSearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<ResolvedSearchParams>; // MODIFIÉ ICI
}

export default function VehicleDetailPage(props: PageProps) {
  // Déstructurer paramsPromise et searchParamsPromise depuis props
  const { params: paramsPromise, searchParams: searchParamsPromise } = props;

  // Résoudre les promesses en utilisant le hook 'use'
  const params = use(paramsPromise); // L'assertion 'as PageParams' n'est plus nécessaire si paramsPromise est bien Promise<PageParams>
  const searchParams = use(searchParamsPromise); // RÉSOUT LA PROMESSE searchParams
  // Même si searchParams n'est pas utilisé activement, il faut le résoudre.
  // Si vous ne l'utilisez pas, vous pouvez le nommer avec un underscore: const _searchParams = use(searchParamsPromise);

  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    // Typage plus explicite pour bookingDates
    startDate: null,
    endDate: null,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      // 'params.id' est disponible ici car 'params' est la valeur résolue
      if (!params || !params.id) {
        console.error("ID de véhicule manquant dans les paramètres.");
        toast.error("ID de véhicule manquant.");
        router.push("/vehicles");
        setIsLoading(false);
        return;
      }
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
  }, [params, router]); // Utiliser params (l'objet résolu) comme dépendance.
  // Ou params.id si c'est la seule partie utilisée.

  useEffect(() => {
    if (vehicle && bookingDates.startDate && bookingDates.endDate) {
      // S'assurer que endDate est après startDate pour éviter les jours négatifs
      if (bookingDates.endDate.getTime() < bookingDates.startDate.getTime()) {
        setTotalPrice(0); // Ou afficher une erreur / désactiver la réservation
        return;
      }
      const days = Math.ceil(
        (bookingDates.endDate.getTime() - bookingDates.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      // Un minimum d'un jour de location si les dates sont les mêmes (ou ajuster la logique)
      setTotalPrice(Math.max(1, days) * vehicle.pricePerDay);
    } else {
      setTotalPrice(0);
    }
  }, [vehicle, bookingDates.startDate, bookingDates.endDate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Optionnel: indiquer un chargement pendant la réservation

    if (!user) {
      toast.error("Vous devez être connecté pour réserver un véhicule");
      router.push("/login");
      setIsLoading(false);
      return;
    }

    const { startDate, endDate } = bookingDates;
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les dates de location");
      setIsLoading(false);
      return;
    }

    if (endDate.getTime() < startDate.getTime()) {
      toast.error(
        "La date de fin ne peut pas être antérieure à la date de début."
      );
      setIsLoading(false);
      return;
    }

    // Vérifier si params.id existe avant de l'utiliser
    if (!params || !params.id) {
      toast.error("ID du véhicule non trouvé. Impossible de réserver.");
      setIsLoading(false);
      return;
    }

    try {
      const booking = await apiService.bookings.create({
        vehicleId: params.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        // totalPrice: totalPrice, // Vous pourriez vouloir envoyer le prix calculé au backend
        // userId: user.id, // Si votre API attend l'ID de l'utilisateur
      });

      toast.success("Réservation effectuée avec succès !");
      router.push(`/bookings/${booking.id}`);
    } catch (error: any) {
      // Typage de l'erreur pour accéder à error.message ou error.response.data
      console.error("Erreur de réservation:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur s'est produite lors de la réservation";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !vehicle) {
    // Afficher le loader seulement si le véhicule n'est pas encore chargé
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        {" "}
        {/* Ajustement de la hauteur */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" />{" "}
        {/* Augmentation de la taille et couleur */}
      </div>
    );
  }

  // Si le chargement est terminé (setIsLoading(false) a été appelé) mais le véhicule est null
  // (par exemple, après une erreur de fetch et une redirection qui n'a pas encore eu lieu ou a échoué)
  if (!vehicle) {
    // La redirection dans useEffect devrait déjà avoir eu lieu.
    // Ce return est une sécurité ou pour les cas où la redirection n'est pas immédiate.
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Chargement des informations du véhicule...</p>
        {/* Ou un message d'erreur si la redirection a échoué */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Retour</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image du véhicule */}
        <div className="relative aspect-video md:aspect-[4/3] lg:aspect-video rounded-lg overflow-hidden shadow-lg">
          {" "}
          {/* Ratio d'aspect et ombre */}
          <Image
            src={vehicle.imageUrl || "/images/default-car.jpg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px" // Attribut sizes pour l'optimisation
            className="object-cover"
            priority // Si c'est l'élément le plus important visuellement au chargement
          />
        </div>

        {/* Informations et formulaire de réservation */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-primary">
              {vehicle.pricePerDay}€{" "}
              <span className="text-sm font-normal text-gray-600">/ jour</span>
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Localisation: {vehicle.city}
            </p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-xl font-semibold mb-3">Caractéristiques</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Année</dt>
                <dd className="font-medium">{vehicle.year}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Transmission</dt>
                <dd className="font-medium">{vehicle.transmission}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Carburant</dt>
                <dd className="font-medium">{vehicle.fuelType}</dd>
              </div>
              {/* Ajoutez d'autres caractéristiques si disponibles */}
            </dl>
          </div>

          <form onSubmit={handleBooking} className="border-t pt-6 space-y-6">
            <h3 className="text-xl font-semibold mb-3">Réserver ce véhicule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de début
                </label>
                <DatePicker
                  id="startDate"
                  selected={bookingDates.startDate}
                  onChange={(date) =>
                    setBookingDates((prev) => ({
                      ...prev,
                      startDate: date,
                      // Optionnel: si la date de fin est avant la nouvelle date de début, la réinitialiser
                      endDate:
                        prev.endDate &&
                        date &&
                        prev.endDate.getTime() < date.getTime()
                          ? null
                          : prev.endDate,
                    }))
                  }
                  minDate={new Date()}
                  maxDate={bookingDates.endDate || undefined}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Sélectionner une date"
                  locale={fr}
                  required
                  className="w-full" // Assurez-vous que votre DatePicker accepte className
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de fin
                </label>
                <DatePicker
                  id="endDate"
                  selected={bookingDates.endDate}
                  onChange={(date) =>
                    setBookingDates((prev) => ({
                      ...prev,
                      endDate: date,
                    }))
                  }
                  minDate={bookingDates.startDate || new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Sélectionner une date"
                  locale={fr}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                {" "}
                {/* Style amélioré */}
                <h4 className="text-lg font-semibold mb-2 text-primary-700">
                  Récapitulatif du prix
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Prix total estimé</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalPrice}€
                  </span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-lg py-3 hover:cursor-pointer" // Taille de police et padding augmentés
              disabled={
                !bookingDates.startDate ||
                !bookingDates.endDate ||
                isLoading ||
                totalPrice <= 0
              } // Désactiver si pas de dates, en chargement, ou prix nul
            >
              {isLoading && !vehicle ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}{" "}
              {/* Loader dans le bouton pendant la soumission */}
              Réserver maintenant
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
