import type { Metadata } from "next";
import ArtistasNationalCatalogClient from "@/app/artistas/ArtistasNationalCatalogClient";
import { SCLASS_ROSTER_14_FORMATS } from "@/lib/constants/pricing-catalog";
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from "@/lib/constants/ear-os-ssot";

export const metadata: Metadata = {
  title: "Directorio Nacional de Artistas & Shows en Directo (5.359 Auditados) · Productora EAR",
  description:
    `Catálogo nacional de música en directo: Edwin Agudelo (Solista Premium ${TARIFA_BASE_SOLISTA_EUR}€), Mariachis (6, 9 y 13 músicos), DJs en vivo, Saxofonistas y Grupos de Versiones. Sonido profesional Bose y reserva directa con ${DEPOSITO_STRIPE_EUR} € de depósito.`,
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
      `5.359 artistas y formaciones musicales auditadas. Show Solista Premium ${TARIFA_BASE_SOLISTA_EUR}€, Mariachi en vivo, DJs y Grupos. Sonido profesional Bose F1 812.`,
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
      `Show Solista Premium (${TARIFA_BASE_SOLISTA_EUR}€), Mariachi en vivo, DJs y Grupos de Versiones. Reserva directa con ${DEPOSITO_STRIPE_EUR} € de depósito.`,
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
      telephone: CENTRALITA_EAR_OS,
      email: "direccion@productoraear.com",
      url: "https://productoraear.com/artistas",
      image: "https://productoraear.com/images/brand/ear_logo_official_diamond.png",
      worksFor: {
        "@type": "Organization",
        name: "Productora EAR",
        url: "https://productoraear.com",
        telephone: CENTRALITA_EAR_OS,
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
    {
      "@type": "Product",
      "@id": "https://productoraear.com/artistas#solista-premium",
      name: "Show Solista Premium — Edwin Agudelo",
      description:
        "Espectáculo solista en directo con repertorio de rancheras de gala, boleros S-Class y baladas. Sonido profesional Bose F1 812 y microfonía Shure Axient RF Beta 87A.",
      image: "https://productoraear.com/images/brand/ear_logo_official_diamond.png",
      brand: {
        "@type": "Brand",
        name: "Productora EAR",
      },
      offers: {
        "@type": "Offer",
        url: "https://productoraear.com/reservar/solista",
        priceCurrency: "EUR",
        price: `${TARIFA_BASE_SOLISTA_EUR}.00`,
        priceValidUntil: "2026-12-31",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "Productora EAR",
          telephone: CENTRALITA_EAR_OS,
        },
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
    </main>
  );
}