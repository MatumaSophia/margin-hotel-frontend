import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestBookingForm } from "@/components/booking/guest-booking-form";

export const metadata = {
    title: "Book Your Stay | Margin Hotel",
    description: "Reserve a room at Margin Hotel in a few simple steps.",
};

export default function BookPage() {
    return (
        <div className="container max-w-2xl py-16">
            <h1 className="text-2xl font-bold mb-1">Book your stay</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Enter your details and pick a room - we&apos;ll confirm your booking
                right away.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Guest booking</CardTitle>
                </CardHeader>
                <CardContent>
                    <GuestBookingForm />
                </CardContent>
            </Card>
        </div>
    );
}
