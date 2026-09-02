"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const AstraPortalSClass = dynamic(() => import("@/modules/SClassScreens/AstraPortalSClass"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#d4af37] font-mono uppercase tracking-[0.3em]">Cargando Astra AI Portal...</div>
});

export default function AstraPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-white p-8">Cargando Astra...</div>}>
      <AstraPortalSClass />
    </Suspense>
  );
}
