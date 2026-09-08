import { Navbar } from "@/components/layout/navbar";
import { RoomCard } from "@/components/rooms/room-card";
import { roomList } from "@/data/rooms";

export const metadata = {
  title: "Our Rooms · Margin Hotel",
  description:
    "Browse available rooms at Margin Hotel and view full details before you book.",
};

export default function RoomsPage() {
  return (
    <>
      <Navbar />

      <main className="container py-16 sm:py-24">
        <h1 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Find Your Perfect Stay
        </h1>

        <p className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-10">
          Browse our available rooms and view full details before you book.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomList.map((room) => (
            <RoomCard key={room.roomId} room={room} />
          ))}
        </div>
      </main>
    </>
  );
}
