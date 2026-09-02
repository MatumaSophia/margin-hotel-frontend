import { z } from "zod";

// Matches the BookingChannel enum assumed on the backend - see the
// contract notes in lib/api/booking.ts.
export const BOOKING_CHANNELS = ["ONLINE", "WALK_IN", "TELEPHONIC"] as const;
export type BookingChannel = (typeof BOOKING_CHANNELS)[number];

export const bookingFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    contactNumber: z.string().min(10, "Enter a valid contact number"),
    roomId: z.string().min(1, "Select a room"),
    checkInDate: z.string().min(1, "Check-in date is required"),
    checkOutDate: z.string().min(1, "Check-out date is required"),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bookingFormDefaultValues: BookingFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  roomId: "",
  checkInDate: "",
  checkOutDate: "",
};
