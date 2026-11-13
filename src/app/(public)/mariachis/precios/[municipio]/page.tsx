import React, { Suspense } from "react";
import UniversalPricingEngine from "@/components/booking/UniversalPricingEngine";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ municipio: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio } = await params;
  const decodedCity = decodeURIComponent(municipio).replace(/-/g, " ");
  const capitalizedCity = decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1);

  return {
    title: `Precios de Mariachis Oficiales en ${capitalizedCity} | Tarifas y Reserva Blindada`,
    description: `Contrata mariachis oficiales en ${capitalizedCity} y alrededores. Sin agencias intermediarias, llegada garantizada con radar en tiempo real y pago 100% protegido.`,
  };
}

export default async function MunicipioPreciosPage({ params }: Props) {
  const { municipio } = await params;
  const decodedCity = decodeURIComponent(municipio).replace(/-/g, " ");
  const capitalizedCity = decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link 
          href="/mariachis/precios" 
          className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          ← Ver Todas las Zonas
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div className="p-12 text-center text-zinc-500">Cargando sala de contratación...</div>}>
          <UniversalPricingEngine 
            categorySlug="mariachis"
            initialMunicipio={capitalizedCity}
            title={`Precios de Mariachis Oficiales en ${capitalizedCity}`}
          />
        </Suspense>
      </div>
    </div>
  );
}