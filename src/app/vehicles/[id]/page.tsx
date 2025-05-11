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
import DatePicker from "@/components/ui/custom/DatePicker";

type PageParams = {
  id: string;
};

interface PageProps {
  params: Promise<PageParams>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function VehicleDetailPage(props: PageProps) {
  const { params: paramsPromise } = props;
  const params = use(paramsPromise) as PageParams;
  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [totalPrice, setTotalPrice] = useState(0);

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

  useEffect(() => {
    if (vehicle && bookingDates.startDate && bookingDates.endDate) {
      const days = Math.ceil(
        (bookingDates.endDate.getTime() - bookingDates.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setTotalPrice(days * vehicle.pricePerDay);
    } else {
      setTotalPrice(0);
    }
  }, [vehicle, bookingDates.startDate, bookingDates.endDate]);

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
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      toast.success("Réservation effectuée avec succès !");
      router.push(`/bookings/${booking.id}`);
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la réservation");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Retour</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image du véhicule */}
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src={vehicle.imageUrl || "/images/default-car.jpg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Informations et formulaire de réservation */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-xl font-semibold text-primary">
              {vehicle.pricePerDay}€ / jour
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Caractéristiques</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-gray-600">Année</dt>
                  <dd>{vehicle.year}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Transmission</dt>
                  <dd>{vehicle.transmission}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Carburant</dt>
                  <dd>{vehicle.fuelType}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Ville</dt>
                  <dd>{vehicle.city}</dd>
                </div>
              </dl>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date de début
                  </label>
                  <DatePicker
                    selected={bookingDates.startDate}
                    onChange={(date) =>
                      setBookingDates({
                        ...bookingDates,
                        startDate: date,
                      })
                    }
                    minDate={new Date()}
                    maxDate={bookingDates.endDate || undefined}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Sélectionner une date"
                    locale={fr}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date de fin
                  </label>
                  <DatePicker
                    selected={bookingDates.endDate}
                    onChange={(date) =>
                      setBookingDates({
                        ...bookingDates,
                        endDate: date,
                      })
                    }
                    minDate={bookingDates.startDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Sélectionner une date"
                    locale={fr}
                    required
                  />
                </div>
              </div>

              {totalPrice > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Récapitulatif</h4>
                  <div className="flex justify-between items-center">
                    <span>Prix total</span>
                    <span className="text-xl font-bold text-primary">
                      {totalPrice}€
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full hover:cursor-pointer"
                disabled={!bookingDates.startDate || !bookingDates.endDate}
              >
                Réserver maintenant
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
