"use client";

import { useState, useMemo, ChangeEvent } from "react";
import { Vehicle } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface VehiclesFilterProps {
  vehicles: Vehicle[];
  onFilter: (filteredVehicles: Vehicle[]) => void;
}

type Filters = {
  year: string;
  brand: string;
  fuelType: string;
  transmission: string;
  city: string;
  maxPrice: string;
};

export function VehiclesFilter({ vehicles, onFilter }: VehiclesFilterProps) {
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    year: "all",
    brand: "all",
    fuelType: "all",
    transmission: "all",
    city: "all",
    maxPrice: "",
  });

  // Récupérer les listes uniques de marques et villes
  const brands = Array.from(new Set(vehicles.map((v) => v.brand))).sort();
  const cities = Array.from(new Set(vehicles.map((v) => v.city))).sort();
  const years = Array.from(
    new Set(vehicles.map((v) => v.year.toString()))
  ).sort((a, b) => b.localeCompare(a)); // Tri décroissant
  // Appliquer les filtres avec useMemo
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (
        currentFilters.year !== "all" &&
        vehicle.year.toString() !== currentFilters.year
      )
        return false;
      if (
        currentFilters.brand !== "all" &&
        vehicle.brand !== currentFilters.brand
      )
        return false;
      if (
        currentFilters.fuelType !== "all" &&
        vehicle.fuelType !== currentFilters.fuelType
      )
        return false;
      if (
        currentFilters.transmission !== "all" &&
        vehicle.transmission !== currentFilters.transmission
      )
        return false;
      if (currentFilters.city !== "all" && vehicle.city !== currentFilters.city)
        return false;
      if (
        currentFilters.maxPrice &&
        vehicle.pricePerDay > Number(currentFilters.maxPrice)
      )
        return false;
      return true;
    });
  }, [currentFilters, vehicles]);

  // Appeler onFilter quand les résultats filtrés changent
  useMemo(() => {
    onFilter(filteredVehicles);
  }, [filteredVehicles, onFilter]);

  const handleFilterChange = (name: string, value: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setCurrentFilters({
      year: "all",
      brand: "all",
      fuelType: "all",
      transmission: "all",
      city: "all",
      maxPrice: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Année</Label>
          <Select
            value={currentFilters.year}
            onValueChange={(value) => handleFilterChange("year", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les années" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Marque</Label>
          <Select
            value={currentFilters.brand}
            onValueChange={(value) => handleFilterChange("brand", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les marques" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les marques</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Carburant</Label>
          <Select
            value={currentFilters.fuelType}
            onValueChange={(value) => handleFilterChange("fuelType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les carburants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les carburants</SelectItem>
              <SelectItem value="Essence">Essence</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Électrique">Électrique</SelectItem>
              <SelectItem value="Hybride">Hybride</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Transmission</Label>
          <Select
            value={currentFilters.transmission}
            onValueChange={(value) => handleFilterChange("transmission", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les transmissions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les transmissions</SelectItem>
              <SelectItem value="Manual">Manuelle</SelectItem>
              <SelectItem value="Automatic">Automatique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Select
            value={currentFilters.city}
            onValueChange={(value) => handleFilterChange("city", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Prix maximum par jour (€)</Label>
          <Input
            type="number"
            value={currentFilters.maxPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFilterChange("maxPrice", e.target.value)
            }
            placeholder="Prix maximum"
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleReset} variant="outline">
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
}
