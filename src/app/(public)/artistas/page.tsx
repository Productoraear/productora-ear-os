import type { Metadata } from "next";
import SovereignRosterGrid from "@/components/marketplace/SovereignRosterGrid";

export const metadata: Metadata = {
  title:
    "Edwin Agudelo & Productora EAR — Artistas, Formatos y Roster Homologado | EAR OS",
  description:
    "Contrata a Edwin Agudelo (Solista desde 350 €) y el Roster Soberano de Productora EAR: Dúo, Trío, Cuarteto, Quinteto, Gran Ensamble, VIMUME B2G, Mariachi Femenino, Discomóvil Bose F1, Saxo Lounge, Flamenco Pop, Coro Rociero y más. Hub Central en Méntrida (Toledo).",
  keywords: [
    "Edwin Agudelo",
    "Productora EAR",
    "solista Toledo",
    "músicos para eventos",
    "boda música en directo",
    "VIMUME residencias mayores",
    "discomóvil Bose F1",
    "mariachi femenino",
    "saxo lounge",
    "flamenco pop",
    "coro rociero",
    "Méntrida Toledo",
  ],
  alternates: { canonical: "/artistas" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/artistas",
    siteName: "Productora EAR — EAR OS",
    title:
      "Edwin Agudelo & Productora EAR — Roster Soberano de 14 Formatos Homologados",
    description:
      "Solista desde 350 €. Rider acústico 12 W/pax, Split Soberano 80/10/10 y depósito Stripe de 100 € con Price-Lock SHA-256. Hub Central en Méntrida (Toledo).",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edwin Agudelo & Productora EAR — Roster Soberano",
    description:
      "14 formatos homologados de música en directo. Contratación en 1-Clic con depósito Stripe SHA-256.",
  },
};

interface RosterService {
  position: number;
  name: string;
  provider: string;
  price: number;
  description: string;
}

const ROSTER_SERVICES: readonly RosterService[] = [
  {
    position: 1,
    name: "Solista",
    provider: "Edwin Agudelo",
    price: 350,
    description:
      "Voz y guitarra en directo. Formato insignia de Productora EAR con base en el Hub Central de Méntrida (Toledo).",
  },
  {
    position: 2,
    name: "Dúo",
    provider: "Productora EAR",
    price: 480,
    description:
      "Voz y piano o guitarra con arreglos de cámara para eventos íntimos, cenas y actos corporativos.",
  },
  {
    position: 3,
    name: "Trío",
    provider: "Productora EAR",
    price: 600,
    description:
      "Voz, guitarra y percusión para cócteles, ceremonias y celebraciones familiares.",
  },
  {
    position: 4,
    name: "Cuarteto",
    provider: "Productora EAR",
    price: 750,
    description:
      "Formación de cámara con cuerdas y vientos para galas, presentaciones y eventos premium.",
  },
  {
    position: 5,
    name: "Quinteto",
    provider: "Productora EAR",
    price: 900,
    description:
      "Cinco músicos en escena con sonido de banda para bodas y eventos corporativos.",
  },
  {
    position: 6,
    name: "Gran Ensamble",
    provider: "Productora EAR",
    price: 1400,
    description:
      "Ensemble completo con sección rítmica y vientos para festivales, salones y grandes celebraciones.",
  },
  {
    position: 7,
    name: "VIMUME B2G",
    provider: "VIMUME",
    price: 480,
    description:
      "Formato homologado para residencias de mayores y centros de día con nivel sonoro < 75 dB SPL.",
  },
  {
    position: 8,
    name: "Pantallas LED",
    provider: "Técnica EAR",
    price: 250,
    description:
      "Pared de vídeo modular para mapping, directos y experiencias visuales en eventos.",
  },
  {
    position: 9,
    name: "Mariachi Femenino",
    provider: "Productora EAR",
    price: 700,
    description:
      "Tradición mexicana con voz femenina principal para celebraciones y mañanitas.",
  },
  {
    position: 10,
    name: "Discomóvil Bose F1",
    provider: "Técnica EAR",
    price: 450,
    description:
      "DJ set con columnas Bose F1 812 y microfonía Shure Axient RF. Presión acústica de 12 W/pax.",
  },
  {
    position: 11,
    name: "Dúo Clásico",
    provider: "Productora EAR",
    price: 380,
    description:
      "Voz y piano con repertorio de clásicos universales para momentos solemnes.",
  },
  {
    position: 12,
    name: "Saxo Lounge",
    provider: "Productora EAR",
    price: 400,
    description:
      "Saxofón en directo con base electrónica para cócteles y ambientes lounge.",
  },
  {
    position: 13,
    name: "Flamenco Pop",
    provider: "Productora EAR",
    price: 650,
    description:
      "Fusión de flamenco y pop con palmas, guitarra española y voz protagonista.",
  },
  {
    position: 14,
    name: "Coro Rociero",
    provider: "Productora EAR",
    price: 800,
    description:
      "Coro de voces para hermandades, romerías y actos religiosos al aire libre.",
  },
];

const itemListNode = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Roster Soberano de Productora EAR — 14 Formatos Homologados",
  description:
    "Catálogo oficial de formatos y proveedores homologados por Productora EAR, con base en el Hub Central de Méntrida (Toledo).",
  itemListOrder: "ItemListOrderAscending",
  numberOfItems: ROSTER_SERVICES.length,
  itemListElement: ROSTER_SERVICES.map((service) => ({
    "@type": "ListItem",
    position: service.position,
    item: {
      "@type": "Service",
      name: `${service.name} — ${service.provider}`,
      description: service.description,
      provider: {
        "@type": "Organization",
        name: "Productora EAR",
        telephone: "+34 693 693 048",
      },
      areaServed: { "@type": "Country", name: "España" },
      offers: {
        "@type": "Offer",
        price: service.price.toFixed(2),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `/checkout/presupuesto?format=${service.name.toLowerCase().replace(/\s+/g, "-")}&base=${service.price}`,
      },
    },
  })),
};

const personNode = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Edwin Agudelo",
  jobTitle: "Artista, cantante y compositor de amplia trayectoria y oficio real sobre el escenario",
  worksFor: { "@type": "Organization", name: "Productora EAR" },
  knowsAbout: ["Música en directo", "Voz y guitarra", "Eventos premium"],
};

export default function ArtistasPage() {
  return (
    <main style={{ background: "#050505", color: "#ffffff" }}>
      {/* JSON-LD Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListNode) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personNode) }}
      />

      {/* HERO CINEMATOGRÁFICO */}
      <section
        className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(236,182,19,0.14) 0%, rgba(5,5,5,0) 60%), linear-gradient(180deg, #09090d 0%, #050505 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <p
            style={{ color: "#AAD6CD", fontSize: 12, letterSpacing: "0.35em" }}
            className="uppercase"
          >
            Productora EAR · Hub Central Méntrida (Toledo)
          </p>

          <h1
            style={{ fontFamily: '"Syne", "Inter", sans-serif' }}
            className="mt-4 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl"
          >
            Edwin Agudelo
            <span style={{ color: "#ecb613" }}>.</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>
              Voz, oficio y escenario.
            </span>
          </h1>

          <p
            style={{ color: "rgba(255,255,255,0.68)", fontSize: 17 }}
            className="mt-6 max-w-2xl leading-relaxed"
          >
            Artista, cantante y compositor de amplia trayectoria y oficio real sobre el
            escenario. Productora EAR orquesta su Roster Soberano: 14 formatos homologados,
            rider acústico certificado de 12 W/pax y cierre transaccional con depósito Stripe
            de 100 € firmado SHA-256.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#roster"
              style={{ background: "#ecb613", color: "#050505" }}
              className="rounded-xl px-7 py-4 text-sm font-bold tracking-wide transition-opacity hover:opacity-90"
            >
              Explorar los 14 Formatos
            </a>
            <a
              href={`https://wa.me/34693693048?text=${encodeURIComponent(
                "Hola EAR OS, quiero información sobre Edwin Agudelo y sus formatos."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ border: "1px solid rgba(170,214,205,0.4)", color: "#AAD6CD" }}
              className="rounded-xl px-7 py-4 text-sm font-semibold tracking-wide transition-colors hover:bg-[#AAD6CD]/10"
            >
              WhatsApp +34 693 693 048
            </a>
          </div>

          {/* Métricas S-Class */}
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4" style={{ background: "rgba(255,255,255,0.08)" }}>
            {[
              { value: "14", label: "Formatos homologados" },
              { value: "350 €", label: "Tarifa base Solista" },
              { value: "12 W/pax", label: "Rider acústico" },
              { value: "80/10/10", label: "Split Soberano" },
            ].map((metric) => (
              <div key={metric.label} style={{ background: "#09090d" }} className="px-6 py-6">
                <dt className="sr-only">{metric.label}</dt>
                <dd
                  style={{
                    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                    color: "#ecb613",
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {metric.value}
                </dd>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.12em" }} className="mt-1 uppercase">
                  {metric.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ROSTER SOBERANO */}
      <SovereignRosterGrid />
    </main>
  );
}