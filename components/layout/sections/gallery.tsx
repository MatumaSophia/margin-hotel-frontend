import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  label: string;
  className?: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    alt: "Standard room with a comfortable bed at Margin Hotel",
    label: "Standard Room",
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    alt: "Deluxe room interior at Margin Hotel",
    label: "Deluxe Room",
  },
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    alt: "Suite with lounge area at Margin Hotel",
    label: "Suite",
  },
  {
    src: "https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?auto=format&fit=crop&w=800&q=80",
    alt: "Margin Hotel lobby",
    label: "Lobby",
  },
  {
    src: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80",
    alt: "Margin Hotel pool and deck",
    label: "Pool & Deck",
  },
];

export const GallerySection = () => {
  return (
    <section id="gallery" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Gallery
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Our Rooms &amp; Hotel
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        A closer look at the spaces waiting for you — from our rooms to the
        shared spaces around the hotel.
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px] gap-4">
        {galleryImages.map(({ src, alt, label, className }) => (
          <div
            key={label}
            className={`group relative overflow-hidden rounded-lg border h-48 lg:h-full ${className ?? ""}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0" />
            <span className="absolute bottom-3 left-3 text-sm font-semibold text-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
