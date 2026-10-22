import type { Metadata } from "next";
import OmniChannelHub360 from "@/components/portal/OmniChannelHub360";

const SITE_URL = "https://productoraear.com";
const PAGE_URL = `${SITE_URL}/experiencia`;
const PAGE_TITLE = "Experiencia 360° | Productora EAR OS";
const PAGE_DESCRIPTION =
  "Plataforma de alta fidelidad para Particulares, Artistas, Fincas y Ayuntamientos. Split 80/10/10 y reserva blindada.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Productora EAR OS",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const JSON_LD: Readonly<Record<string, unknown>> = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Productora EAR OS",
      url: SITE_URL,
    },
    {
      "@type": "EntertainmentBusiness",
      "@id": `${PAGE_URL}#business`,
      name: "Productora EAR OS",
      url: PAGE_URL,
      description: PAGE_DESCRIPTION,
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      areaServed: "ES",
    },
  ],
};

export default function ExperienciaPage(): React.JSX.Element {
  const jsonLd = JSON.stringify(JSON_LD).replace(/</g, "\\u003c");
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white py-16 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <div className="max-w-7xl mx-auto">
        <OmniChannelHub360 />
      </div>
    </main>
  );
}
