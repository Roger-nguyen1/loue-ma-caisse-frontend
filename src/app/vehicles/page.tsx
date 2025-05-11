"use client";

import { useEffect, useState } from "react";
import { Vehicle } from "@/types";
import { apiService } from "@/services/api";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await apiService.vehicles.getAll();
        setVehicles(data);
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Véhicules disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={`/vehicles/${vehicle.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
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
                <p className="text-gray-600 mb-2">Année : {vehicle.year}</p>
                <p className="text-primary-600 font-semibold">
                  {vehicle.pricePerDay}€ / jour
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            Aucun véhicule disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
