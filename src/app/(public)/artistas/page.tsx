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

interface ArtistOfferItem {
  "@type": "Offer";
  itemOffered: {
    "@type": "Service";
    name: string;
    description: string;
  };
  price: string;
  priceCurrency: "EUR";
  availability: string;
  url: string;
}

interface ArtistSchemaGraph {
  "@context": "https://schema.org";
  "@graph": ReadonlyArray<Record<string, unknown>>;
}

const artistSchema: ArtistSchemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://productoraear.com/artistas#edwin-agudelo",
      name: "Edwin Agudelo",
      jobTitle: "Tenor lírico y popular, productor audiovisual y fundador de Productora EAR",
      description:
        "Tenor lírico y popular, productor audiovisual y fundador de Productora EAR y del Proyecto neuroacústico VIMUME. 25 años de oficio en escena y coordinación de 37 macroconciertos internacionales.",
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
        itemListElement: SCLASS_ROSTER_14_FORMATS.map(
          (format): ArtistOfferItem => ({
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
          }),
        ),
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

export default function ArtistasCinematicPage(): React.JSX.Element {
  return (
    <main className="relative w-full max-w-full overflow-x-hidden bg-[#030305] text-white antialiased selection:bg-amber-400/30 selection:text-amber-100">
      {/* Schema.org estructurado JSON-LD con los formatos oficiales */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
      />

      {/* Capa decorativa OLED: halo radial sutil para profundidad cinematográfica */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)]"
      />

      {/* Contenedor del catálogo con micro-animaciones de entrada */}
      <div className="relative z-10 animate-[fadeIn_600ms_ease-out_both] motion-reduce:animate-none">
        <ArtistasNationalCatalogClient />
      </div>

      {/* Estilos locales para micro-animaciones S-Class (CTA hover, fade-in) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes ctaShimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            @keyframes ctaPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.35); }
              50% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
            }
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001ms !important;
                scroll-behavior: auto !important;
              }
            }
            /* CTA buttons: hover states y micro-animaciones globales del catálogo */
            main a[role="button"],
            main button[data-cta="true"],
            main .cta-primary {
              position: relative;
              overflow: hidden;
              transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
                          box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
                          background-color 220ms ease,
                          color 220ms ease,
                          border-color 220ms ease,
                          letter-spacing 220ms ease;
              will-change: transform, box-shadow;
              backface-visibility: hidden;
              -webkit-tap-highlight-color: transparent;
            }
            main a[role="button"]::after,
            main button[data-cta="true"]::after,
            main .cta-primary::after {
              content: "";
              position: absolute;
              inset: 0;
              background: linear-gradient(
                110deg,
                transparent 30%,
                rgba(255, 255, 255, 0.18) 50%,
                transparent 70%
              );
              background-size: 200% 100%;
              opacity: 0;
              pointer-events: none;
              transition: opacity 220ms ease;
            }
            main a[role="button"]:hover,
            main button[data-cta="true"]:hover,
            main .cta-primary:hover {
              transform: translateY(-2px);
              letter-spacing: 0.01em;
              box-shadow: 0 12px 32px -12px rgba(245, 158, 11, 0.55),
                          0 0 0 1px rgba(245, 158, 11, 0.35);
            }
            main a[role="button"]:hover::after,
            main button[data-cta="true"]:hover::after,
            main .cta-primary:hover::after {
              opacity: 1;
              animation: ctaShimmer 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            main a[role="button"]:active,
            main button[data-cta="true"]:active,
            main .cta-primary:active {
              transform: translateY(0) scale(0.985);
              box-shadow: 0 6px 18px -10px rgba(245, 158, 11, 0.45);
            }
            main a[role="button"]:focus-visible,
            main button[data-cta="true"]:focus-visible,
            main .cta-primary:focus-visible {
              outline: 2px solid rgba(245, 158, 11, 0.85);
              outline-offset: 3px;
              border-radius: 0.5rem;
            }
            /* CTA destacado: pulso sutil continuo */
            main .cta-primary[data-pulse="true"],
            main button[data-cta="true"][data-pulse="true"] {
              animation: ctaPulse 2600ms ease-in-out infinite;
            }
            /* Tarjetas del catálogo: elevación sutil al hover */
            main article,
            main .catalog-card {
              transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
                          border-color 260ms ease,
                          box-shadow 260ms ease,
                          background-color 260ms ease;
              will-change: transform, box-shadow;
              backface-visibility: hidden;
            }
            main article:hover,
            main .catalog-card:hover {
              transform: translateY(-3px);
              border-color: rgba(245, 158, 11, 0.35);
              box-shadow: 0 18px 40px -22px rgba(0, 0, 0, 0.9),
                          0 0 0 1px rgba(245, 158, 11, 0.18);
            }
            main article:focus-within,
            main .catalog-card:focus-within {
              border-color: rgba(245, 158, 11, 0.45);
              box-shadow: 0 18px 40px -22px rgba(0, 0, 0, 0.9),
                          0 0 0 1px rgba(245, 158, 11, 0.28);
            }
            /* Enlaces de texto: subrayado animado sutil */
            main a:not([role="button"]):not(.cta-primary) {
              transition: color 200ms ease, opacity 200ms ease;
            }
            main a:not([role="button"]):not(.cta-primary):hover {
              color: rgba(252, 211, 77, 1);
            }
            /* Imágenes del catálogo: zoom sutil al hover de tarjeta */
            main article img,
            main .catalog-card img {
              transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
                          filter 420ms ease;
              will-change: transform;
            }
            main article:hover img,
            main .catalog-card:hover img {
              transform: scale(1.03);
              filter: brightness(1.05) saturate(1.05);
            }
          `,
        }}
      />
    </main>
  );
}