"use client";

import { useEffect, useState } from "react";
import { Vehicle } from "@/types";
import { apiService } from "@/services/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyVehiclesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyVehicles = async () => {
      if (!user) {
        toast.error("Veuillez vous connecter pour accéder à vos véhicules");
        router.push("/login");
        return;
      }
      try {
        const data = await apiService.vehicles.getMyVehicles();
        setVehicles(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Erreur Axios:", error.response?.data);
          console.error("Status:", error.response?.status);
          console.error("Headers:", error.response?.headers);
          const message =
            error.response?.data?.message ||
            "Impossible de charger vos véhicules";
          toast.error(message);
        } else {
          console.error(
            "Erreur non-Axios lors du chargement des véhicules:",
            error
          );
          toast.error("Une erreur inattendue est survenue");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyVehicles();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Véhicules</h1>
        <Button
          onClick={() => router.push("/vehicles/new")}
          className="hover:cursor-pointer"
        >
          Ajouter un véhicule
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de véhicule à louer
          </p>
          <Button
            onClick={() => router.push("/vehicles/new")}
            className="hover:cursor-pointer"
          >
            Ajouter mon premier véhicule
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link href={`/vehicles/${vehicle.id}`}>
                <div className="relative h-48">
                  <Image
                    src={vehicle.imageUrl || "/images/default-car.jpg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">{vehicle.city}</p>
                    <p className="font-bold text-primary">
                      {vehicle.pricePerDay}€ / jour
                    </p>
                  </div>{" "}
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        vehicle.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vehicle.available ? "Disponible" : "Indisponible"}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-4 border-t flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/vehicles/${vehicle.id}/edit`);
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (
                      confirm(
                        "Êtes-vous sûr de vouloir supprimer ce véhicule ?"
                      )
                    ) {
                      try {
                        await apiService.vehicles.delete(vehicle.id);
                        setVehicles(
                          vehicles.filter((v) => v.id !== vehicle.id)
                        );
                        toast.success("Véhicule supprimé avec succès");
                      } catch (error) {
                        console.error("Erreur lors de la suppression:", error);
                        toast.error(
                          "Erreur lors de la suppression du véhicule"
                        );
                      }
                    }
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
