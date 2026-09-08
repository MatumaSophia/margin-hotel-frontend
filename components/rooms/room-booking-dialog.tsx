"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/booking-form";
import { ROOM_TYPE_LABELS, type Room } from "@/data/rooms";

interface RoomBookingDialogProps {
  room: Room;
}

// "Book Room" opens a focused overlay containing just the booking form,
// pinned to this room (no room picker) - reuses the same BookingForm used
// on /book and the staff admin portal. Room details stay on the page
// behind it; nothing is duplicated inside the dialog.
export const RoomBookingDialog = ({ room }: RoomBookingDialogProps) => {
  if (room.status !== "AVAILABLE") {
    return (
      <div>
        <Button disabled className="font-bold">
          Book Room
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This room is currently unavailable. Please check back later or
          browse our other rooms.
        </p>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold">Book Room</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Reserve Room {room.roomNumber} · {ROOM_TYPE_LABELS[room.type]}
          </DialogTitle>
        </DialogHeader>

        <BookingForm channel="ONLINE" fixedRoom={room} compact />
      </DialogContent>
    </Dialog>
  );
};
