import type { Metadata } from "next";
import B2GDossierView from "@/components/b2g/B2GDossierView";

export const metadata: Metadata = {
  title: "Expediente de Contratación Menor B2G | Productora EAR OS",
  description:
    "Dossier oficial de contratación menor LCSP Art. 118 (< 14.250 €) con códigos DIR3, desglose económico e impacto social VIMUME.",
  robots: { index: false, follow: false },
};

export default function ExpedientePage(): React.JSX.Element {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <B2GDossierView />
      </div>
    </main>
  );
}
