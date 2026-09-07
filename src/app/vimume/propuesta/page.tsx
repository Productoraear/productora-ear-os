import React from "react";
import Link from "next/link";

export const metadata = {
  title: "VIMUME | Propuesta Institucional B2B & B2G",
  description: "Musicoterapia sensorial activa y estimulación cognitiva para personas mayores bajo marco de Contrato Menor (Art. 118 LCSP).",
};

export default function VimumePropuestaPage() {
  const whatsappUrl = "https://wa.me/34693693048?text=" + encodeURIComponent("Hola Edwin, represento a una entidad/residencia y queremos una propuesta de VIMUME.");

  return (
    <main className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans antialiased selection:bg-[#258DCD] selection:text-white">
      {/* Header Institucional */}
      <header className="border-b border-[#1a1a1a] bg-[#050505]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-wider text-white">VIMUME</span>
            <span className="text-xs px-2.5 py-0.5 rounded border border-[#258DCD] text-[#258DCD] font-mono uppercase">
              S-Class Clinical
            </span>
          </div>
          <Link
            href={whatsappUrl}
            target="_blank"
            className="text-xs font-mono tracking-wide px-4 py-2 border border-[#258DCD] text-[#258DCD] hover:bg-[#258DCD] hover:text-black transition-colors rounded"
          >
            ATENCIÓN INSTITUCIONAL: +34 693 693 048
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="inline-block mb-4 px-3 py-1 rounded bg-[#1a1a1a] text-[#AAD6CD] text-xs font-mono tracking-wider border border-[#258DCD]/30">
          PROGRAMA COGNITIVO-SENSORIAL PARA CENTROS Y MUNICIPIOS
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl text-white mb-6">
          Musicoterapia Activa y Estimulación Sensorial para Personas Mayores.
        </h1>
        <p className="text-lg sm:text-xl text-[#AAD6CD] max-w-2xl leading-relaxed mb-10">
          Reactivación de memoria emocional mediante estímulo acústico calibrado. Rigor clínico, trazabilidad neuropsicológica y diseño sin fricción administrativa.
        </p>

        {/* CTA Dual */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link
            href="/docs/dossier-vimume.pdf"
            download
            className="inline-flex justify-center items-center px-8 py-4 rounded bg-white text-black font-semibold hover:bg-[#AAD6CD] transition-colors shadow-lg"
          >
            Descargar Dossier Técnico-Clínico (PDF)
          </Link>
          <Link
            href={whatsappUrl}
            target="_blank"
            className="inline-flex justify-center items-center px-8 py-4 rounded border border-[#258DCD] text-[#258DCD] hover:bg-[#258DCD]/10 transition-colors font-semibold"
          >
            Solicitar Propuesta para Municipio / Residencia
          </Link>
        </div>
      </section>

      {/* Blindaje Técnico y Acústico */}
      <section className="border-t border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-[#1a1a1a] p-8 rounded bg-[#050505]">
            <div className="text-xs font-mono text-[#258DCD] mb-2 uppercase">Garantía Acústica</div>
            <h2 className="text-2xl font-bold mb-3">&lt; 75 dB SPL</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Presión sonora rigurosamente controlada. Totalmente inocuo para entornos sanitarios y residentes con fragilidad auditiva o alteraciones conductuales.
            </p>
          </div>

          <div className="border border-[#1a1a1a] p-8 rounded bg-[#050505]">
            <div className="text-xs font-mono text-[#258DCD] mb-2 uppercase">Marco de Contratación</div>
            <h2 className="text-2xl font-bold mb-3">Art. 118 LCSP</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Apto para tramitación bajo Contrato Menor del Sector Público. Proyectos llave en mano con importe directo acotado a &lt; 14.250,00 €.
            </p>
          </div>

          <div className="border border-[#1a1a1a] p-8 rounded bg-[#050505]">
            <div className="text-xs font-mono text-[#258DCD] mb-2 uppercase">Evidencia y Memoria</div>
            <h2 className="text-2xl font-bold mb-3">Trazabilidad</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Informes de impacto tras cada ciclo de sesiones. Documentación cuantitativa y cualitativa para dirección asistencial y concejalías de bienestar social.
            </p>
          </div>
        </div>
      </section>

      {/* Paquetes Operativos */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-xs font-mono text-[#258DCD] uppercase tracking-wider mb-2">Modalidades de Implementación</h2>
        <h3 className="text-3xl font-bold text-white mb-12">Estructura de Servicios B2B / B2G</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Paquete 1 */}
          <div className="border border-[#1a1a1a] p-8 rounded bg-[#081226]/20 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#AAD6CD] uppercase">Fase Inicial</span>
              <h4 className="text-2xl font-bold mt-2 mb-4">Programa Piloto</h4>
              <p className="text-sm text-neutral-400 mb-6">
                4 sesiones intensivas para validación clínica en centro sociosanitario o programa municipal específico.
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 mb-8 font-mono">
                <li>• Diagnóstico sensorial previo</li>
                <li>• 4 intervenciones de 60 min</li>
                <li>• Informe de resultados clínicos</li>
              </ul>
            </div>
            <Link
              href={whatsappUrl}
              target="_blank"
              className="w-full text-center py-3 border border-[#258DCD] text-[#258DCD] hover:bg-[#258DCD] hover:text-black transition-colors rounded text-sm font-semibold"
            >
              Consultar Disponibilidad
            </Link>
          </div>

          {/* Paquete 2 */}
          <div className="border border-[#258DCD] p-8 rounded bg-[#081226]/40 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-6 bg-[#258DCD] text-black text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold">
              Recomendado Institucional
            </div>
            <div>
              <span className="text-xs font-mono text-[#AAD6CD] uppercase">Continuidad</span>
              <h4 className="text-2xl font-bold mt-2 mb-4">Ciclo Trimestral</h4>
              <p className="text-sm text-neutral-400 mb-6">
                Intervención regular de 12 sesiones con evaluación bimensual y seguimiento de respuesta cognitiva.
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 mb-8 font-mono">
                <li>• 12 sesiones estructuradas</li>
                <li>• Control sonométrico certificado</li>
                <li>• Memoria para justificación pública</li>
              </ul>
            </div>
            <Link
              href={whatsappUrl}
              target="_blank"
              className="w-full text-center py-3 bg-[#258DCD] text-black hover:bg-[#AAD6CD] transition-colors rounded text-sm font-semibold"
            >
              Solicitar Pliego Técnico
            </Link>
          </div>

          {/* Paquete 3 */}
          <div className="border border-[#1a1a1a] p-8 rounded bg-[#081226]/20 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#AAD6CD] uppercase">Programa Integral</span>
              <h4 className="text-2xl font-bold mt-2 mb-4">Convenio Anual</h4>
              <p className="text-sm text-neutral-400 mb-6">
                Cobertura institucional completa adaptada a partidas presupuestarias de mayores e igualdad.
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 mb-8 font-mono">
                <li>• Calendario anual programado</li>
                <li>• Adaptado a Art. 118 LCSP (&lt; 14.250 €)</li>
                <li>• Certificación continua de impacto</li>
              </ul>
            </div>
            <Link
              href={whatsappUrl}
              target="_blank"
              className="w-full text-center py-3 border border-[#258DCD] text-[#258DCD] hover:bg-[#258DCD] hover:text-black transition-colors rounded text-sm font-semibold"
            >
              Procesar Convenio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 text-center text-xs font-mono text-neutral-500">
        VIMUME © Productora EAR — Soberanía Operativa y Tecnológica. Tel: +34 693 693 048
      </footer>
    </main>
  );
}
