import type { Metadata } from "next";
import ArtistCinematicProfile from "@/components/artists/ArtistCinematicProfile";
import { SCLASS_ROSTER_14_FORMATS } from "@/lib/constants/pricing-catalog";

export const metadata: Metadata = {
  title: "Edwin Agudelo & Roster S-Class de 14 Formatos | Productora EAR",
  description:
    "Catálogo oficial de Productora EAR: Edwin Agudelo y los 14 Formatos Homologados (Solista 350€, Dúo 480€, Trío 600€, Cuarteto 750€, Quinteto 900€, Gran Ensamble 1.400€, VIMUME B2G, Discomóvil Bose F1). Presión acústica garantizada a 12 W/pax, Split 80/10/10 y reserva directa con depósito Stripe de 100 €.",
  keywords: [
    "Edwin Agudelo",
    "Roster Productora EAR",
    "14 formatos homologados",
    "contratar mariachi Madrid Toledo",
    "solista de gala 350",
    "quinteto mariachi 900",
    "boda s-class diamond 3800",
    "rider acustico Bose F1",
    "Shure Beta 87A",
    "Proyecto VIMUME",
    "Méntrida Toledo",
  ],
  alternates: { canonical: "https://www.productoraear.com/artistas" },
  openGraph: {
    type: "profile",
    locale: "es_ES",
    url: "https://www.productoraear.com/artistas",
    siteName: "Productora EAR — EAR OS",
    title: "Edwin Agudelo & Roster S-Class de 14 Formatos (Major Label Standard)",
    description:
      "Voz, Oficio y Escenario. Catálogo íntegro de 14 formatos homologados con tarifas suelo inmutables, acústica Bose a 12 W/pax y cierre transaccional con depósito Stripe de 100 €.",
    images: [
      {
        url: "https://www.productoraear.com/images/brand/ear_diamante_central.png",
        width: 1200,
        height: 630,
        alt: "Edwin Agudelo & Roster S-Class Productora EAR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edwin Agudelo & Roster S-Class — 14 Formatos Homologados",
    description:
      "14 formatos musicales y técnicos con rider Bose/Shure garantizado a 12 W/pax. Depósito reembolsable de 100 € con Price-Lock SHA-256.",
    images: ["https://www.productoraear.com/images/brand/ear_diamante_central.png"],
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
      image: "https://www.productoraear.com/images/brand/ear_diamante_central.png",
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
        name: "Roster Soberano de 14 Formatos Homologados",
        itemListElement: SCLASS_ROSTER_14_FORMATS.map((format) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: format.name,
            description: `${format.description} Rider: ${format.rider}. Integrantes: ${format.members}. Presión: ${format.wattsPerPax} W/pax.`,
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
      {/* Schema.org estructurado JSON-LD con los 14 formatos */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
      />
      <ArtistCinematicProfile
        name="Edwin Agudelo"
        specialty="Voz, Oficio y Escenario · Tenor Lírico & Roster Soberano"
        imageUrl="/images/brand/ear_diamante_central.png"
      />
    </main>
  );
}