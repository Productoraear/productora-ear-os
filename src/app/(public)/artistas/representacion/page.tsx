import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Representación Artística y Management | Productora EAR',
  description: 'Representación artística exclusiva, booking y dirección técnica para solistas, orquestas y formaciones musicales.',
};

export default function RepresentacionPage() {
  return (
    <main className="bg-black text-white min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">
        Representación de Artistas y Management Oficial
      </h1>
      
      <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
        <p>
          Gestión integral de contratación directa de solistas y elencos musicales con rider técnico acústico homologado y liquidaciones automatizadas bajo el Split Soberano (80% Artista / 10% EAR OS / 10% VIMUME).
        </p>

        <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
          <h2 className="text-xl font-semibold text-white mb-4">Ficha Técnica y Condiciones Transaccionales</h2>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Tarifa Base Solista (Edwin Agudelo):</strong> 350,00 € (Hub Central Méntrida, Toledo).</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Logística y Kilometraje:</strong> 1,50 €/km a partir del km 50 (+120 € suplemento hotelero si fin &ge; 3:00 AM o distancia &gt; 200 km).</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Rider y Presión Acústica:</strong> 12 W/pax (Sistemas Bose F1 Model 812 / S1 Pro, Microfonía Shure Beta 87A).</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Límite VIMUME B2G:</strong> &lt; 15.000,00 € (Ajuste preventivo Art. 118 LCSP = 14.250,00 €).</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span><strong>Depósito Transaccional:</strong> 100,00 € mediante Stripe con firma Price-Lock SHA-256.</span>
            </li>
          </ul>
        </section>

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
            Cotizar Disponibilidad de Caché
          </a>
        </div>
      </div>
    </main>
  );
}
