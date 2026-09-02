"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { createBooking, type BookingResponse } from "@/lib/api/booking";
import { getRooms, type RoomOption } from "@/lib/api/rooms";
import {
    bookingFormDefaultValues,
    bookingFormSchema,
    type BookingChannel,
    type BookingFormValues,
} from "@/lib/validations/booking-schema";

export interface BookingFormProps {
    /** Fixed booking channel for this instance of the form. */
    channel: BookingChannel;
    /** Called after the booking is created successfully. */
    onSuccess?: (booking: BookingResponse) => void;
    /** Hide the section titles when embedding inside another card/dialog. */
    compact?: boolean;
}

/**
 * Guest details + room + stay dates, submitted to POST /booking/create.
 *
 * This is the one form used everywhere a booking is created:
 *  - guest-facing site -> <BookingForm channel="ONLINE" />
 *  - staff admin portal -> <BookingForm channel="WALK_IN" /> or "TELEPHONIC"
 *
 * Only the fixed `channel` differs between contexts; fields, validation,
 * and submit behaviour are identical, so channel-specific screens should
 * wrap this component rather than duplicate it.
 */
export function BookingForm({ channel, onSuccess, compact }: BookingFormProps) {
    const [rooms, setRooms] = useState<RoomOption[]>([]);
    const [roomsError, setRoomsError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submittedBooking, setSubmittedBooking] = useState<BookingResponse | null>(null);

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: bookingFormDefaultValues,
    });

    useEffect(() => {
        let cancelled = false;

        getRooms()
            .then((data) => {
                if (!cancelled) setRooms(data.filter((room) => room.status === "AVAILABLE"));
            })
            .catch((err) => {
                if (!cancelled) {
                    setRoomsError(
                        err instanceof ApiError
                            ? err.message
                            : "Couldn't load rooms. Try refreshing the page."
                    );
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    async function onSubmit(values: BookingFormValues) {
        setSubmitError(null);
        try {
            const booking = await createBooking({
                channel,
                guest: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    contactNumber: values.contactNumber,
                },
                roomId: values.roomId,
                checkInDate: values.checkInDate,
                checkOutDate: values.checkOutDate,
            });
            setSubmittedBooking(booking);
            form.reset(bookingFormDefaultValues);
            onSuccess?.(booking);
        } catch (err) {
            setSubmitError(
                err instanceof ApiError
                    ? err.message
                    : "Something went wrong creating the booking. Please try again."
            );
        }
    }

    if (submittedBooking) {
        return (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center space-y-2">
                <p className="font-semibold">Booking confirmed</p>
                <p className="text-sm text-muted-foreground">
                    Booking #{submittedBooking.bookingId} for room {submittedBooking.roomId} has
                    been created.
                </p>
                <Button variant="secondary" onClick={() => setSubmittedBooking(null)}>
                    Create another booking
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    {!compact && <h3 className="font-semibold text-lg">Guest details</h3>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Thabo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nkosi" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="guest@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact number</FormLabel>
                                    <FormControl>
                                        <Input
                                            inputMode="numeric"
                                            placeholder="0821234567"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {!compact && <h3 className="font-semibold text-lg">Stay details</h3>}
                    <FormField
                        control={form.control}
                        name="roomId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an available room" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.roomId} value={room.roomId}>
                                                Room {room.roomNumber} — {room.type} (R{room.pricePerNight}/night)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {roomsError && (
                                    <p className="text-sm text-destructive">{roomsError}</p>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="checkInDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Check-in date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="checkOutDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Check-out date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {submitError && <p className="text-sm text-destructive">{submitError}</p>}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Booking..." : "Confirm booking"}
                </Button>
            </form>
        </Form>
    );
}
