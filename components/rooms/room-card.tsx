import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROOM_TYPE_LABELS, type Room } from "@/data/rooms";

const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

interface RoomCardProps {
  room: Room;
}

// Preview card for the rooms listing page - "View Room" navigates to the
// room's own page (see app/rooms/[roomId]/page.tsx) for full details and
// booking.
export const RoomCard = ({ room }: RoomCardProps) => {
  const available = room.status === "AVAILABLE";

  return (
    <Card className="bg-muted/60 dark:bg-card h-full flex flex-col overflow-hidden">
      <div className="relative">
        <Image
          src={room.imageUrl}
          alt={`${ROOM_TYPE_LABELS[room.type]} room`}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
        />
        {!available && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            Unavailable
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl">
            {ROOM_TYPE_LABELS[room.type]}
          </CardTitle>
          <Badge variant="outline">Room {room.roomNumber}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span>
            {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
          </span>
        </div>

        <div className="text-lg font-bold">
          {zar.format(room.pricePerNight)}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / night
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild variant="secondary" className="w-full font-bold">
          <Link href={`/rooms/${room.roomId}`}>View Room</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
