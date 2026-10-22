import type { Metadata } from "next";
import LiveFleetTracker from "@/components/telemetry/LiveFleetTracker";

interface SeguimientoPageProps {
  params: Promise<{ id: string }>;
}

const sanitizeId = (raw: string): string =>
  raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);

export const metadata: Metadata = {
  title: "Seguimiento en Vivo del Evento | Productora EAR OS",
  robots: { index: false, follow: false },
};

export default async function SeguimientoPage({
  params,
}: SeguimientoPageProps): Promise<React.JSX.Element> {
  const resolvedParams = await params;
  const id = sanitizeId(resolvedParams.id);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <LiveFleetTracker missionId={id || "SIN-ID"} />
      </div>
    </main>
  );
}
