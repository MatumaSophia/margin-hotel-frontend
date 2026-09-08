import { apiFetch } from "@/lib/api/client";

// Matches za.ac.cput.domain.Room / RoomFactory on the backend.
export interface RoomOption {
  roomId: string;
  roomNumber: number;
  type: "STANDARD" | "DELUXE" | "SUITE";
  pricePerNight: number;
  status: "AVAILABLE" | "OCCUPIED";
}

/**
 * ASSUMED endpoint — following the /{resource}/getAll convention used
 * elsewhere in this project. Confirm the actual path once the Room
 * controller exists, and swap this for an availability-aware endpoint
 * (e.g. filtered by the selected dates) when the backend supports it.
 */
export function getRooms() {
  return apiFetch<RoomOption[]>("/room/getAll");
}
