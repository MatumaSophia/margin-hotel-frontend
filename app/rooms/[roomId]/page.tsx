import { notFound } from "next/navigation";
import Image from "next/image";
import { Users } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { BackButton } from "@/components/layout/back-button";
import { RoomBookingDialog } from "@/components/rooms/room-booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getRoomById, roomList, ROOM_TYPE_LABELS } from "@/data/rooms";

const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

interface RoomPageProps {
  params: { roomId: string };
}

export function generateStaticParams() {
  return roomList.map((room) => ({ roomId: room.roomId }));
}

export function generateMetadata({ params }: RoomPageProps) {
  const room = getRoomById(params.roomId);

  return {
    title: room ? `${ROOM_TYPE_LABELS[room.type]} · Margin Hotel` : "Room not found",
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const room = getRoomById(params.roomId);

  if (!room) {
    notFound();
  }

  const available = room.status === "AVAILABLE";

  return (
    <>
      <Navbar />

      <main className="container py-10 sm:py-16">
        <BackButton />

        <div className="grid gap-10 lg:grid-cols-2 mt-4">
          <div className="relative rounded-lg overflow-hidden border border-secondary">
            <Image
              src={room.imageUrl}
              alt={`${ROOM_TYPE_LABELS[room.type]} room`}
              width={900}
              height={700}
              className="w-full h-[320px] sm:h-[420px] lg:h-full object-cover"
              priority
            />
            {!available && (
              <Badge
                variant="destructive"
                className="absolute top-4 right-4 text-sm py-1"
              >
                Unavailable
              </Badge>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <Badge variant="outline">Room {room.roomNumber}</Badge>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              {ROOM_TYPE_LABELS[room.type]}
            </h1>

            <div className="text-2xl font-bold mt-3">
              {zar.format(room.pricePerNight)}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / night
              </span>
            </div>

            <p className="text-muted-foreground mt-4">{room.description}</p>

            <Separator className="my-6" />

            <RoomBookingDialog room={room} />
          </div>
        </div>
      </main>
    </>
  );
}
