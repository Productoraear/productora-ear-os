import type { Metadata } from "next";
import ArtistCinematicProfile from "@/components/artists/ArtistCinematicProfile";

export const metadata: Metadata = {
  title: "Edwin Agudelo — Tenor, Productor & Roster S-Class | Productora EAR",
  description:
    "Ficha Integral de Edwin Agudelo: Tenor lírico, artista y compositor de amplia trayectoria y oficio real sobre el escenario. Rider técnico Shure Axient/Beta 87A, PA Bose F1 812 a 12 W/pax, fundador del Proyecto VIMUME y contratación directa con depósito Stripe de 100 € firmado SHA-256.",
  keywords: [
    "Edwin Agudelo",
    "Edwin Agudelo cantante",
    "contratar Edwin Agudelo",
    "tenor lírico bodas",
    "mariachi de gala Madrid Toledo",
    "Productora EAR artistas",
    "rider acustico Bose F1 812",
    "Shure Beta 87A",
    "Proyecto VIMUME",
    "musica para bodas de lujo",
    "Méntrida Toledo",
  ],
  alternates: { canonical: "https://www.productoraear.com/artistas" },
  openGraph: {
    type: "profile",
    locale: "es_ES",
    url: "https://www.productoraear.com/artistas",
    siteName: "Productora EAR — EAR OS",
    title: "Edwin Agudelo — Ficha Integral S-Class (Sony / Warner Standard)",
    description:
      "Voz, Oficio y Escenario. Rider técnico de concierto (Shure Beta 87A, Behringer XR18, Bose F1 812), repertorio de catarsis emocional y Proyecto VIMUME. Tarifa base desde 350 €.",
    images: [
      {
        url: "https://www.productoraear.com/images/brand/ear_diamante_central.png",
        width: 1200,
        height: 630,
        alt: "Edwin Agudelo - Master Artist Productora EAR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edwin Agudelo — Tenor & Arquitecto Escénico S-Class",
    description:
      "Ficha integral de artista: Repertorio, Rider técnico garantizado a 12 W/pax y cierre transaccional en 1-clic con depósito Stripe de 100 €.",
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
        name: "Formatos Oficiales de Contratación",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Solista de Gala (Edwin Agudelo)",
              description: "Voz de tenor y guitarra en directo con sonorización Bose S1 Pro / F1 812.",
            },
            price: "350.00",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: "https://www.productoraear.com/checkout/presupuesto?format=solista&base=350",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Quinteto Tradicional de Mariachi",
              description: "Voz principal + 2 Trompetas + Vihuela + Guitarrón con trajes charros de gala.",
            },
            price: "750.00",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: "https://www.productoraear.com/checkout/presupuesto?format=quinteto&base=750",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Boda S-Class Diamond 360",
              description: "Sonorización integral de 3 espacios (12-18 W/pax) y actuación central de Edwin Agudelo.",
            },
            price: "3800.00",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: "https://www.productoraear.com/checkout/presupuesto?format=boda-diamond&base=3800",
          },
        ],
      },
    },
  ],
};

export default function ArtistasCinematicPage() {
  return (
    <main>
      {/* Schema.org estructurado JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
      />
      <ArtistCinematicProfile
        name="Edwin Agudelo"
        specialty="Voz, Oficio y Escenario · Tenor Lírico"
        imageUrl="/images/brand/ear_diamante_central.png"
      />
    </main>
  );
}