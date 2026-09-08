"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/booking-form";
import type { BookingResponse } from "@/lib/api/booking";
import type { BookingChannel, BookingFormValues } from "@/lib/validations/booking-schema";

const STAFF_CHANNELS: { value: Extract<BookingChannel, "WALK_IN" | "TELEPHONIC">; label: string }[] = [
    { value: "WALK_IN", label: "Walk-in" },
    { value: "TELEPHONIC", label: "Telephonic" },
];

interface AddBookingDialogProps {
    /** Called after the booking is created successfully, before the dialog closes. */
    onBookingCreated?: (booking: BookingResponse, values: BookingFormValues) => void;
}

/**
 * "Add Booking" button that opens the staff booking form (walk-in/telephonic)
 * in a modal - the same flow used on the admin bookings page, reused
 * wherever staff need to create a booking on a guest's behalf (e.g. from
 * the payments table too).
 */
export function AddBookingDialog({ onBookingCreated }: AddBookingDialogProps) {
    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState<"WALK_IN" | "TELEPHONIC">("WALK_IN");

    function handleSuccess(booking: BookingResponse, values: BookingFormValues) {
        onBookingCreated?.(booking, values);
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (next) setChannel("WALK_IN");
            }}
        >
            <DialogTrigger asChild>
                <Button className="font-bold">Add Booking</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New booking</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground -mt-2">
                    Create a booking on the guest&apos;s behalf — for walk-ins or
                    phone reservations.
                </p>

                <div className="flex gap-2">
                    {STAFF_CHANNELS.map((c) => (
                        <Button
                            key={c.value}
                            type="button"
                            variant={channel === c.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setChannel(c.value)}
                        >
                            {c.label}
                        </Button>
                    ))}
                </div>

                <BookingForm key={channel} channel={channel} compact onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
