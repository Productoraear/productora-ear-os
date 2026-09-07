import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archivo Clínico de Musicoterapia y Estimulación Neurocognitiva | VIMUME',
  description: 'Protocolo de intervención neuroacústica en residencias de mayores y centros de día. Seguridad clínica estricta < 75 dB SPL.',
};

export default function ArchivoClinicoPage() {
  return (
    <main className="bg-black text-white min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">
        Archivo Clínico: Estimulación Neurocognitiva y Musicoterapia VIMUME
      </h1>

      <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
        <p>
          Metodología clínica no farmacológica aplicada a geriatría, centros de día y unidades de memoria. Diseño de paisajes sonoros y reminiscencia musical con monitorización de impacto cognitivo y emocional.
        </p>

        <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
          <h2 className="text-xl font-semibold text-white mb-4">Protocolo de Seguridad Acústica y B2G</h2>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Límite de Presión Sonora:</strong> Estricto &lt; 75 dB SPL en recintos geriátricos para evitar fatiga auditiva o desorientación sensorial.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Equipamiento Homologado:</strong> Altavoces Bose S1 Pro con dispersión controlada y microfonía vocal optimizada Shure Beta.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Marco de Contratación B2G:</strong> Contratos menores ajustados a Art. 118 LCSP (&lt; 15.000,00 €, ajuste preventivo 14.250,00 €).</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Split Soberano:</strong> 80% Artista / 10% EAR OS / 10% Fondo Clínico VIMUME.</span>
            </li>
          </ul>
        </section>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="tel:+34693693048"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition"
          >
            Contacto Clínico: +34 693 693 048
          </a>
          <a
            href="/cotizador"
            className="inline-flex items-center justify-center px-6 py-3 border border-zinc-700 text-white font-semibold rounded hover:bg-zinc-900 transition"
          >
            Solicitar Protocolo para Centro
          </a>
        </div>
      </div>
    </main>
  );
}