import { Metadata } from "next";
import { SClassProEmpMenu } from "@/components/fincas/sclass-pro/SClassProEmpMenu";

export const metadata: Metadata = {
  title: "S-Class Pro • Portal B2B de Proveedores & Fincas de Élite | Productora EAR",
  description: "Panel de control soberano para proveedores de eventos de alta gama: CRM de novios, escaparate con teléfono 24/7 sin censura, rider acústico Bose < 75 dB SPL, opiniones 5.0 y split 80/10/10.",
  keywords: [
    "portal proveedores bodas",
    "b2b fincas eventos",
    "escaparate proveedores bodas",
    "rider acustico bose bodas",
    "musica bodas alta fidelidad",
    "productora ear edwin agudelo",
    "split 80 10 10",
    "stripe price lock deposito 100"
  ],
  alternates: {
    canonical: "https://productoraear.com/pro",
  },
  openGraph: {
    title: "S-Class Pro • Portal B2B de Proveedores & Fincas de Élite",
    description: "Gestión soberana de solicitudes, rider acústico Bose y facturación directa sin cuotas de intermediación.",
    url: "https://productoraear.com/pro",
    siteName: "Productora EAR — EAR OS",
    locale: "es_ES",
    type: "website",
  },
};

export default function ProPortalPage() {
  return <SClassProEmpMenu />;
}
