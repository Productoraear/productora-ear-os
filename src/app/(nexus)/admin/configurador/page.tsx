"use client";
import React from 'react';
import { ConfiguradorBespoke } from "@/modules/SClassScreens/ConfiguradorBespoke";

export default function ConfigPage() {
  return (
    <main className="min-h-screen bg-[#080808] p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <ConfiguradorBespoke />
      </div>
    </main>
  );
}
