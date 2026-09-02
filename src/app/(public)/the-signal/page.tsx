"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const TheSignalSClass = dynamic(() => import("@/modules/SClassScreens/TheSignal"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#d4af37] font-mono uppercase tracking-[0.3em]">
      Sincronizando The Signal Radar...
    </div>
  )
});

export default function TheSignalPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 sm:p-8">
      <Suspense fallback={<div>Cargando The Signal...</div>}>
        <TheSignalSClass />
      </Suspense>
    </main>
  );
}
