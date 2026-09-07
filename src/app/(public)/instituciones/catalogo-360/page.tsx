import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo Integral 360 Institucional | Productora EAR',
  description: 'Catálogo integral técnico, audiovisual, iluminación y producción escénica para administraciones públicas y corporaciones.',
};

export default function Catalogo360Page() {
  return (
    <main className="bg-black text-white min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">
        Catálogo 360° Institucional y Corporativo
      </h1>

      <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
        <p>
          Infraestructura de vanguardia y dirección técnica integral para eventos de gran formato, teatros, actos solemnes y programaciones culturales públicas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Ingeniería Acústica y Rider S-Class</h3>
            <p className="text-sm text-zinc-400">
              Sistemas de sonido de alta fidelidad calculados a <span className="text-cyan-400 font-mono">12 W/pax</span>. Line Arrays Bose F1 812, microfonía Shure Beta 87A y mesas digitales Midas/Behringer X32 para inteligibilidad de voz inmaculada.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Iluminación Escénica y DMX</h3>
            <p className="text-sm text-zinc-400">
              Cabezas móviles robotizadas Chauvet/Cameo Pro, cegadoras LED, guirnaldas arquitectónicas y control DMX por software profesional con cumplimiento de normativas de consumo eficiente.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Escenarios y Estructuras Layher</h3>
            <p className="text-sm text-zinc-400">
              Tarimas modulares homologadas, techado truss de aluminio, torres de elevación VMB y certificados de solidez y seguro de responsabilidad civil para cualquier consistorio.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Homologación B2G y Contratos Menores</h3>
            <p className="text-sm text-zinc-400">
              Ajuste estricto al techo de gasto del <span className="text-cyan-400 font-mono">Art. 118 LCSP</span> (&lt; 15.000 €). Registro Oficial de Licitadores (ROLECE) y tramitación telemática directa.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <span className="text-xs uppercase text-zinc-500 font-mono">Canal Oficial de Asignación</span>
            <p className="text-xl font-bold text-white">+34 693 693 048</p>
          </div>
          <a
            href="tel:+34693693048"
            className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition text-center"
          >
            Solicitar Dossier Técnico 360°
          </a>
        </div>
      </div>
    </main>
  );
}
