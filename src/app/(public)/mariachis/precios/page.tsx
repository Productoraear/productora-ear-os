import React from "react";
import UniversalPricingEngine from "@/components/booking/UniversalPricingEngine";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios de Mariachis Oficiales | Tarifas Cerradas y Reserva Blindada",
  description: "Calcula el precio oficial de mariachis para bodas, serenatas y fiestas. Sin intermediarios, seguimiento en tiempo real y pago 100% protegido.",
};

export default function MariachisPreciosPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link 
          href="/mariachis" 
          className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          ← Volver a Mariachis
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <UniversalPricingEngine 
          categorySlug="mariachis"
          title="Precios Oficiales de Mariachis y Reserva Garantizada"
        />
      </div>
    </div>
  );
}
