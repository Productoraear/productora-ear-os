import type { Metadata } from "next";
import ArtistCinematicProfile from "@/components/artists/ArtistCinematicProfile";
import ArtistNeuralMatcherView from "@/components/artists/ArtistNeuralMatcherView";
import ArtistasNationalCatalogClient from "@/app/artistas/ArtistasNationalCatalogClient";
import { SCLASS_ROSTER_14_FORMATS } from "@/lib/constants/pricing-catalog";

export const metadata: Metadata = {
  title: "Directorio Nacional de Artistas & Shows en Directo (5.359 Auditados) · Productora EAR",
  description:
    "Catálogo nacional de música en directo: Edwin Agudelo (Solista Premium 350€), Mariachis (6, 9 y 13 músicos), DJs en vivo, Saxofonistas y Grupos de Versiones. Sonido profesional Bose y reserva directa con 100 € de depósito.",
  keywords: [
    "contratar artistas bodas",
    "Edwin Agudelo",
    "contratar mariachi Madrid",
    "contratar mariachi Toledo",
    "djs bodas madrid",
    "solista rancheras Madrid",
    "grupos versiones bodas",
    "musica en vivo bodas",
    "Productora EAR",
    "Méntrida Toledo",
  ],
  alternates: { canonical: "https://productoraear.com/artistas" },
  openGraph: {
    type: "profile",
    locale: "es_ES",
    url: "https://productoraear.com/artistas",
    siteName: "Productora EAR",
    title: "Directorio Nacional de Artistas & Shows en Directo · Productora EAR",
    description:
      "5.359 artistas y formaciones musicales auditadas. Show Solista Premium 350€, Mariachi en vivo, DJs y Grupos. Sonido profesional Bose F1 812.",
    images: [
      {
        url: "https://productoraear.com/images/brand/ear_logo_official_diamond.png",
        width: 1200,
        height: 630,
        alt: "Productora EAR Catálogo de Artistas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Directorio Nacional de Artistas & Shows · Productora EAR",
    description:
      "Show Solista Premium (350€), Mariachi en vivo, DJs y Grupos de Versiones. Reserva directa con 100 € de depósito.",
    images: ["https://productoraear.com/images/brand/ear_logo_official_diamond.png"],
  },
};

const artistSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://productoraear.com/artistas#edwin-agudelo",
      name: "Edwin Agudelo",
      jobTitle: "Artista, cantante y compositor de amplia trayectoria y oficio real sobre el escenario",
      description:
        "Tenor lírico y popular, productor audiovisual y fundador de Productora EAR y del Proyecto neuroacústico VIMUME. Más de 25 años de oficio real en escena y coordinación de 37 macroconciertos internacionales.",
      telephone: "+34 693 693 048",
      email: "direccion@productoraear.com",
      url: "https://productoraear.com/artistas",
      image: "https://productoraear.com/images/brand/ear_logo_official_diamond.png",
      worksFor: {
        "@type": "Organization",
        name: "Productora EAR",
        url: "https://productoraear.com",
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
          url: `https://productoraear.com/checkout/presupuesto?format=${format.id}&base=${format.basePrice}`,
        })),
      },
    },
  ],
};

export default function ArtistasCinematicPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      {/* Schema.org estructurado JSON-LD con los formatos oficiales */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
      />
      <ArtistasNationalCatalogClient />
      <ArtistCinematicProfile
        name="Edwin Agudelo"
        specialty="Cantante y Compositor · Rancheras, Boleros y Música de Gala"
        imageUrl="/images/brand/ear_logo_official_diamond.png"
      />
      <ArtistNeuralMatcherView />
    </main>
  );
}

