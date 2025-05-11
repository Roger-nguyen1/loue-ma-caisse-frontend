"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { Vehicle } from "@/types";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type VehicleFormData = {
  brand: string;
  model: string;
  year: number;
  transmission: "Manual" | "Automatic";
  fuelType: "Essence" | "Diesel" | "Électrique" | "Hybride";
  isElectric: boolean;
  city: string;
  pricePerDay: number;
  imageUrl: string;
  description?: string;
  available: boolean;
};

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    transmission: "Manual",
    fuelType: "Essence",
    isElectric: false,
    city: "",
    pricePerDay: 0,
    imageUrl: "",
    description: "",
    available: true,
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const vehicle = await apiService.vehicles.getById(params.id as string);
        setFormData({
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          transmission: vehicle.transmission,
          fuelType: vehicle.fuelType,
          isElectric: vehicle.isElectric,
          city: vehicle.city,
          pricePerDay: vehicle.pricePerDay,
          imageUrl: vehicle.imageUrl || "",
          description: vehicle.description || "",
          available: vehicle.available,
        });
      } catch (error) {
        console.error("Erreur lors du chargement du véhicule:", error);
        toast.error("Impossible de charger les informations du véhicule");
        router.push("/my-vehicles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl.trim()) {
      toast.error("L'URL de l'image est obligatoire");
      return;
    }

    try {
      new URL(formData.imageUrl);
    } catch {
      toast.error("L'URL de l'image n'est pas valide");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.vehicles.update(params.id as string, {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        year: Number(formData.year),
      });
      toast.success("Véhicule modifié avec succès");
      router.push("/my-vehicles");
    } catch (error) {
      console.error("Erreur lors de la modification du véhicule:", error);
      toast.error(
        "Une erreur est survenue lors de la modification du véhicule"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Modifier le véhicule</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Marque</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Modèle</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Année</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prix par jour (€)
              </label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                URL de l'image
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="https://exemple.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Transmission
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              >
                <option value="Manual">Manuelle</option>
                <option value="Automatic">Automatique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Carburant
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              >
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Électrique">Électrique</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="isElectric"
              checked={formData.isElectric}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm font-medium">Véhicule électrique</label>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm font-medium">
              Disponible à la location
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Modification en cours..." : "Modifier le véhicule"}
          </Button>
        </form>
      </div>
    </div>
  );
}
