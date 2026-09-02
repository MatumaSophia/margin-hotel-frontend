"use client";

import { BookingForm } from "@/components/booking/booking-form";

/**
 * Guest-site booking form — the "Book Now" flow on the public site.
 * Just BookingForm pinned to the ONLINE channel; see booking-form.tsx
 * for the actual fields/validation/submit logic.
 */
export function GuestBookingForm() {
    return <BookingForm channel="ONLINE" />;
}
