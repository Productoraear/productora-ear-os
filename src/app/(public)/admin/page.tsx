"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const SystemCockpitSClass = dynamic(() => import("@/modules/SClassScreens/SystemCockpitSClass"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#d4af37] font-mono uppercase tracking-[0.3em]">
      Cargando Valhalla Admin Cockpit...
    </div>
  )
});

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 sm:p-8">
      <Suspense fallback={<div>Cargando Valhalla...</div>}>
        <SystemCockpitSClass />
      </Suspense>
    </main>
  );
}
