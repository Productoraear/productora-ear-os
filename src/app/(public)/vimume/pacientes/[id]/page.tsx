import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VimumePatientDossier from "@/components/vimume/VimumePatientDossier";
import { VIMUME_SAMPLE_PATIENTS } from "@/lib/vimume/vimumePatientEngine";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PacienteDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const patient = VIMUME_SAMPLE_PATIENTS.find((p) => p.id === id) || VIMUME_SAMPLE_PATIENTS[0];

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link 
          href="/vimume/centros" 
          className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] hover:underline"
        >
          <ArrowLeft size={14} /> VOLVER AL DIRECTORIO DE CENTROS
        </Link>

        <VimumePatientDossier patient={patient} />
      </div>
    </main>
  );
}
