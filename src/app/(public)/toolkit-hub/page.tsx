"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const ToolkitHubSClass = dynamic(() => import("@/modules/SClassScreens/ToolkitHubSClass"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#d4af37] font-mono uppercase tracking-[0.3em]">
      Cargando Toolkit Hub S-Class...
    </div>
  )
});

export default function ToolkitHubPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 sm:p-8">
      <Suspense fallback={<div>Cargando Toolkit Hub...</div>}>
        <ToolkitHubSClass />
      </Suspense>
    </main>
  );
}
