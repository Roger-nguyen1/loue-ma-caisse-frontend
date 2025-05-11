export type TransmissionType = "Manual" | "Automatic";
export type FuelType = "Essence" | "Diesel" | "Électrique" | "Hybride";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  isElectric: boolean;
  city: string;
  pricePerDay: number;
  description: string;
  imageUrl: string;
  ownerId: string;
  available: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
