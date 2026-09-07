import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fiestas Patronales y Festivales Municipales | Productora EAR',
  description: 'Gestión integral y contratación de espectáculos, sonido, iluminación y producción técnica para ayuntamientos y festejos municipales.',
};

export default function EventosMunicipalesPage() {
  return (
    <main className="bg-black text-white min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">
        Fiestas Patronales, Semanas Culturales y Festivales de Ayuntamientos
      </h1>
      
      <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
        <p>
          Organizamos eventos municipales que cautivan a la comunidad con su vibrante energía y diversidad cultural. Desde fiestas patronales hasta festivales de música y danza, cada evento es una celebración única con producción técnica homologada.
        </p>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
          <h2 className="text-xl font-semibold text-white mb-3">Pliegos y Normativa B2G</h2>
          <p className="text-sm text-zinc-400">
            Presupuestos ajustados a la normativa <span className="text-cyan-400 font-mono">Art. 118 LCSP</span> para contratos menores con un límite estricto de <span className="text-white font-semibold">15.000,00 €</span> (Ajuste preventivo automático al 95%: <span className="text-white font-semibold">14.250,00 €</span>). Facturación electrónica vía FACe y transparencia pública garantizada.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
          <h2 className="text-xl font-semibold text-white mb-3">Rider y Presión Acústica</h2>
          <p className="text-sm text-zinc-400">
            Estándar S-Class de sonorización: <span className="text-cyan-400 font-mono">12 W/pax</span> con sistemas Bose F1 Model 812 / S1 Pro y microfonía de precisión Shure Beta 87A para un sonido envolvente y equilibrado en plazas y recintos feriales.
          </p>
        </div>

        <p className="pt-4">
          Si estás interesado en cotizar tu evento municipal o solicitar memoria técnica para concurso, contacta directamente con nuestra coordinación institucional:
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="tel:+34693693048"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition"
          >
            Llamar al +34 693 693 048
          </a>
          <a
            href="/cotizador"
            className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 text-white font-semibold rounded hover:bg-zinc-900 transition"
          >
            Ir al Cotizador Oficial
          </a>
        </div>
      </div>
    </main>
  );
}