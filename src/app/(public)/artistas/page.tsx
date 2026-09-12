import type { Metadata } from "next";
import ArtistCinematicProfile from "@/components/artists/ArtistCinematicProfile";
import { SCLASS_ROSTER_14_FORMATS } from "@/lib/constants/pricing-catalog";

export const metadata: Metadata = {
  title: "Edwin Agudelo · Cantante y Compositor · Tarifas y Formatos Oficiales",
  description:
    "Contratación directa de Edwin Agudelo: Show Solista Premium (350€ con sonido Bose 2.000W, sombreros, fotos y ramo) y Agrupaciones en vivo de 6, 9 y 13 músicos (desde 600€). Trato directo desde Méntrida (Toledo). Reserva de fecha con depósito de 100 €.",
  keywords: [
    "Edwin Agudelo",
    "contratar mariachi Madrid",
    "contratar mariachi Toledo",
    "solista rancheras Madrid",
    "solista premium 350",
    "mariachi 6 musicos",
    "mariachi bodas Madrid",
    "musica mexicana en vivo",
    "Productora EAR",
    "Méntrida Toledo",
  ],
  alternates: { canonical: "https://www.productoraear.com/artistas" },
  openGraph: {
    type: "profile",
    locale: "es_ES",
    url: "https://www.productoraear.com/artistas",
    siteName: "Productora EAR",
    title: "Edwin Agudelo · Música en Directo para Bodas y Celebraciones",
    description:
      "Cantante y compositor. Show Solista Premium 350€ y Agrupaciones Mariachi en vivo (6, 9 y 13 integrantes). Sonido profesional Bose y reserva directa de fecha.",
    images: [
      {
        url: "https://www.productoraear.com/images/brand/ear_logo_official_diamond.png",
        width: 1200,
        height: 630,
        alt: "Edwin Agudelo Productora EAR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edwin Agudelo · Cantante y Compositor · Tarifas Oficiales",
    description:
      "Show Solista Premium (350€) y Mariachi en vivo de 6, 9 y 13 músicos. Reserva directa con 100 € de depósito.",
    images: ["https://www.productoraear.com/images/brand/ear_logo_official_diamond.png"],
  },
};

const artistSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.productoraear.com/artistas#edwin-agudelo",
      name: "Edwin Agudelo",
      jobTitle: "Artista, cantante y compositor de amplia trayectoria y oficio real sobre el escenario",
      description:
        "Tenor lírico y popular, productor audiovisual y fundador de Productora EAR y del Proyecto neuroacústico VIMUME. Más de 25 años de oficio real en escena y coordinación de 37 macroconciertos internacionales.",
      telephone: "+34 693 693 048",
      email: "direccion@productoraear.com",
      url: "https://www.productoraear.com/artistas",
      image: "https://www.productoraear.com/images/brand/ear_logo_official_diamond.png",
      worksFor: {
        "@type": "Organization",
        name: "Productora EAR",
        url: "https://www.productoraear.com",
        telephone: "+34 693 693 048",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Méntrida",
          addressRegion: "Toledo",
          addressCountry: "ES",
        },
      },
      award: [
        "Gladiador Extranjero de Oro (2021)",
        "Diploma de Honor Consular (Consulado General de Colombia en Madrid, 2022)",
        "Premio Más Latinos — Trayectoria Continental (2023)",
        "Compositor de la Igualdad (2024)",
      ],
      knowsAbout: [
        "Música en directo para bodas y galas",
        "Rancheras de gala y repertorio charro",
        "Boleros S-Class",
        "Microfonía Shure Axient RF Beta 87A",
        "Sistemas de sonido Bose F1 812",
        "Estimulación neuroacústica VIMUME",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Formatos y Tarifas Oficiales Homologadas",
        itemListElement: SCLASS_ROSTER_14_FORMATS.map((format) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: format.name,
            description: `${format.description} Integrantes: ${format.members}.`,
          },
          price: `${format.basePrice}.00`,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `https://www.productoraear.com/checkout/presupuesto?format=${format.id}&base=${format.basePrice}`,
        })),
      },
    },
  ],
};

export default function ArtistasCinematicPage() {
  return (
    <main>
      {/* Schema.org estructurado JSON-LD con los formatos oficiales */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
      />
      <ArtistCinematicProfile
        name="Edwin Agudelo"
        specialty="Cantante y Compositor · Rancheras, Boleros y Música de Gala"
        imageUrl="/images/brand/ear_logo_official_diamond.png"
      />
    </main>
  );
}