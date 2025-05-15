import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Vehicle,
  Booking,
} from "@/types";
import axios from "axios";

const API_URL = "https://loue-ma-voiture-api.rogernguyen.fr/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  auth: {
    async login(data: LoginRequest): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>("/Auth/login", data);
      return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>("/Auth/register", data);
      return response.data;
    },
  },
  // Vehicles
  vehicles: {
    async getAll(): Promise<Vehicle[]> {
      const response = await api.get<Vehicle[]>("/Vehicles");
      return response.data;
    },
    async getById(id: string): Promise<Vehicle> {
      const response = await api.get<Vehicle>(`/Vehicles/${id}`);
      return response.data;
    },
    async getMyVehicles(): Promise<Vehicle[]> {
      const response = await api.get<Vehicle[]>("/Vehicles/me");
      return response.data;
    },
    async create(data: Partial<Vehicle>): Promise<Vehicle> {
      const response = await api.post<Vehicle>("/Vehicles", data);
      return response.data;
    },

    async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
      const response = await api.put<Vehicle>(`/Vehicles/${id}`, data);
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await api.delete(`/Vehicles/${id}`);
    },
  },

  // Bookings
  bookings: {
    async create(data: {
      vehicleId: string;
      startDate: string;
      endDate: string;
    }): Promise<Booking> {
      const response = await api.post<Booking>("/bookings", data);
      return response.data;
    },

    async getUserBookings(): Promise<Booking[]> {
      const response = await api.get<Booking[]>("/bookings/me");
      return response.data;
    },

    async getById(id: string): Promise<Booking> {
      const response = await api.get<Booking>(`/bookings/${id}`);
      return response.data;
    },
  },
};
