import { apiFetch } from "@/lib/api/client";
import type { BookingChannel } from "@/lib/validations/booking-schema";

/**
 * ASSUMED backend contract for POST /booking/create.
 *
 * As of this writing, `hotel_management_system` only has
 * Booking/BookingFactory/IBookingRepository — there's no controller or DTO
 * yet, and the `Booking` domain has no `channel` field. This client is
 * written against the contract the backend endpoint ticket should expose;
 * confirm/align with whoever builds it:
 *
 *  1. Add `BookingChannel` enum (ONLINE, WALK_IN, TELEPHONIC) and a
 *     `channel` field on `Booking`.
 *  2. `Room.roomId` is a String (e.g. "R001") but `Booking.roomId` is
 *     currently an `int` — that mismatch needs fixing on the backend
 *     before this integrates; this client sends roomId as a string.
 *  3. `POST /booking/create` is assumed to accept nested guest details
 *     and upsert the Guest server-side (walk-in/telephonic guests won't
 *     have a guestId yet), returning the created booking incl. the
 *     generated bookingId and guestId.
 */

export interface CreateBookingGuest {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
}

export interface CreateBookingPayload {
  channel: BookingChannel;
  guest: CreateBookingGuest;
  roomId: string;
  checkInDate: string; // ISO date, e.g. "2026-08-25"
  checkOutDate: string; // ISO date, e.g. "2026-08-27"
}

export interface BookingResponse {
  bookingId: number;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  channel: BookingChannel;
}

export function createBooking(payload: CreateBookingPayload) {
  return apiFetch<BookingResponse>("/booking/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBooking(
  bookingId: number | string,
  payload: Partial<CreateBookingPayload>
) {
  return apiFetch<BookingResponse>(`/booking/update/${bookingId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
