"use client";

import { useEffect, useState } from "react";
import { Vehicle } from "@/types";
import { apiService } from "@/services/api";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { VehiclesFilter } from "@/components/ui/custom/VehiclesFilter";

export default function VehiclesPage() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await apiService.vehicles.getAll();
        setAllVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleFilter = (filtered: Vehicle[]) => {
    setFilteredVehicles(filtered);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Chargement des véhicules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Véhicules disponibles</h1>

      <VehiclesFilter vehicles={allVehicles} onFilter={handleFilter} />

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Aucun véhicule ne correspond à vos critères
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
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
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">{vehicle.city}</p>
                    <p className="font-bold text-primary">
                      {vehicle.pricePerDay}€ / jour
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {vehicle.year} •{" "}
                      {vehicle.transmission === "Manual"
                        ? "Manuelle"
                        : "Automatique"}{" "}
                      • {vehicle.fuelType}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
