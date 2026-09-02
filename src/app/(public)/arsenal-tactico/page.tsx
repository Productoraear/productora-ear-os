"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const ArsenalTacticoSClass = dynamic(() => import("@/modules/SClassScreens/ArsenalTacticoSClass"), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#d4af37] font-mono uppercase tracking-[0.3em]">Cargando Arsenal Táctico...</div>
});

export default function ArsenalTacticoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-white p-8">Cargando Arsenal...</div>}>
      <ArsenalTacticoSClass />
    </Suspense>
  );
}
