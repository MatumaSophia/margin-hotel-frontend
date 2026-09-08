import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/layout/sections/hero";
import { GallerySection } from "@/components/layout/sections/gallery";
import { FeaturesSection } from "@/components/layout/sections/features";
import { ServicesSection } from "@/components/layout/sections/services";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: "Margin Hotel",
  description:
    "Book your stay at Margin Hotel, where comfort meets elegance. Enjoy our luxurious rooms, exceptional service, and prime location for an unforgettable experience.",
  openGraph: {
    type: "website",
    url: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Margin Hotel",
    description:
      "Book your stay at Margin Hotel, where comfort meets elegance. Enjoy our luxurious rooms, exceptional service, and prime location for an unforgettable experience.",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Margin Hotel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Margin Hotel - Landing template",
    description:
      "Book your stay at Margin Hotel, where comfort meets elegance. Enjoy our luxurious rooms, exceptional service, and prime location for an unforgettable experience.",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <GallerySection />
      <FeaturesSection />
      <ServicesSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
