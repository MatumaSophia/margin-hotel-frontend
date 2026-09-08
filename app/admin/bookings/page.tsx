"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingForm } from "@/components/booking/booking-form";
import type { BookingChannel } from "@/lib/validations/booking-schema";

const STAFF_CHANNELS: { value: Extract<BookingChannel, "WALK_IN" | "TELEPHONIC">; label: string }[] = [
    { value: "WALK_IN", label: "Walk-in" },
    { value: "TELEPHONIC", label: "Telephonic" },
];

export default function NewBookingPage() {
    const router = useRouter();
    const [channel, setChannel] = useState<"WALK_IN" | "TELEPHONIC">("WALK_IN");

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-1">New booking</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Create a booking on the guest&apos;s behalf — for walk-ins or phone
                reservations. This is the same form used on the guest site, with the
                channel fixed to how the booking came in.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>
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
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <BookingForm
                        key={channel}
                        channel={channel}
                        onSuccess={() => router.push("/admin/bookings")}
                    />
                </CardContent>
            </Card>
        </div>
    );
}