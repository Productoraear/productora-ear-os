'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, FileText, ShieldCheck, Music, 
  Zap, Download, Award, HeartHandshake, ArrowRight, PhoneCall,
  Sparkles, Users, Gift
} from 'lucide-react';
import { B2GGovFaqAccordion } from '@/components/seo/B2GGovFaqAccordion';

export default function AyuntamientosPage() {
  const [population, setPopulation] = useState<number>(3500);
  const [selectedFormat, setSelectedFormat] = useState<'menor' | 'licitacion'>('menor');

  const estimatedBudget = selectedFormat === 'menor' 
    ? Math.min(14900, Math.max(2800, Math.floor(population * 2.1))) 
    : Math.max(18000, Math.floor(population * 3.8));

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="border-b border-white/10 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={14} /> Red de Solvencia B2G (+8.000 Municipios de España)
            </span>
            <Link 
              href="/soberania-tecnica" 
              className="bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-mono px-3 py-1 rounded-full uppercase transition-colors"
            >
              Homologado FACe / DIR3
            </Link>
            <Link 
              href="/soberania-tecnica" 
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono px-3 py-1 rounded-full uppercase transition-colors"
            >
              Contrato Menor (Art. 118 LCSP)
            </Link>
          </div>

          <h1 className="text-4xl md:text-6xl font-fraunces font-black text-white leading-tight max-w-5xl">
            Soluciones Integrales para Ayuntamientos: Fiestas Patronales, Luces de Navidad &amp; Impacto Social
          </h1>
          <p className="mt-4 text-white/60 font-montserrat text-base md:text-lg max-w-3xl leading-relaxed">
            Plataforma unificada de contratación pública para Concejalías de Festejos, Cultura y Asuntos Sociales. Desde infraestructuras de sonido e iluminación festiva hasta programas neuroacústicos para mayores.
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-[#0a0a0f] to-amber-950/30 border-2 border-[#ecb613]/40 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(236,182,19,0.15)]">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#ecb613] text-black font-black text-[10px] uppercase px-3 py-1 rounded-full">
                <Gift size={14} /> Cláusula Exclusiva de Consenso Municipal
              </div>
              
              <h2 className="text-2xl md:text-4xl font-fraunces font-black text-white leading-tight">
                Contratación en Exclusiva = Proyecto VIMUME Directo para la 3ª Edad
              </h2>
              
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Al adjudicar en exclusiva la producción de las Fiestas Patronales a Productora EAR, aportamos <strong>totalmente bonificado el Proyecto VIMUME (Viaje Musical por la Memoria)</strong> en directo con <strong>Edwin Agudelo como Solista</strong> para las Residencias y Centros de Día del municipio.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link 
                  href="/soberania-tecnica" 
                  className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center gap-3 hover:border-[#ecb613]/50 transition-colors"
                >
                  <Award className="text-[#ecb613] shrink-0" size={20} />
                  <span className="text-xs text-white/80 font-bold">Unanimidad entre Festejos, Cultura y Asuntos Sociales</span>
                </Link>
                <Link 
                  href="/vimume" 
                  className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center gap-3 hover:border-pink-400/50 transition-colors"
                >
                  <HeartHandshake className="text-pink-400 shrink-0" size={20} />
                  <span className="text-xs text-white/80 font-bold">Sin sobrecoste para las arcas municipales</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-black/60 border border-white/10 rounded-2xl p-6 text-center space-y-4">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider block">Acuerdo Marco B2G</span>
              <div className="text-2xl font-black text-white font-fraunces">VIMUME INCLUIDO</div>
              <p className="text-[11px] text-white/50">Concierto lírico + Estimulación neuroacústica para la residencia municipal.</p>
              <a
                href="https://wa.me/34693693048?text=Hola,%20queremos%20información%20sobre%20el%20Pacto%20Exclusivo%20VIMUME%20para%20Ayuntamientos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-xs rounded-xl transition-colors inline-block font-bold"
              >
                Activar Consenso Municipal
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-fraunces font-black text-white uppercase">
              Catálogo 360° de Servicios Municipales
            </h2>
            <p className="text-white/50 text-xs">
              Módulos adaptables a presupuestos desde pequeños municipios hasta grandes ayuntamientos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/artistas/edwin-agudelo"
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 hover:border-[#ecb613]/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ecb613] group-hover:scale-110 transition-transform">
                  <Music size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white group-hover:text-[#ecb613] transition-colors">Fiestas Patronales</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Orquestas de gala, Mariachi Imperial de Edwin Agudelo, grupos de versiones y escenarios móviles con sonido L-Acoustics.
                </p>
              </div>
              <span className="text-[10px] text-[#ecb613] font-mono mt-4 flex items-center gap-1 font-bold">
                Gala &amp; Noche Patronal <ArrowRight size={12} />
              </span>
            </Link>

            <Link 
              href="/alquiler-equipos-sonido-audiovisuales"
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 hover:border-blue-400/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white group-hover:text-blue-400 transition-colors">Luces de Navidad</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Alquiler, diseño e instalación de iluminación festiva LED de bajo consumo para plazas mayores, calles comerciales y fachadas consistoriales.
                </p>
              </div>
              <span className="text-[10px] text-blue-400 font-mono mt-4 flex items-center gap-1 font-bold">
                Campaña Navideña LED <ArrowRight size={12} />
              </span>
            </Link>

            <Link 
              href="/vimume"
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 hover:border-pink-400/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                  <Users size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white group-hover:text-pink-400 transition-colors">Espectáculos Senior</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Gala de Copla, Canción Española, Boleros de Autor y homenajes de memoria viva para la Semana de la Tercera Edad.
                </p>
              </div>
              <span className="text-[10px] text-pink-400 font-mono mt-4 flex items-center gap-1 font-bold">
                Día del Mayor &amp; Homenajes <ArrowRight size={12} />
              </span>
            </Link>

            <Link 
              href="/alquiler-equipos-sonido-audiovisuales"
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 hover:border-emerald-400/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Zap size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white group-hover:text-emerald-400 transition-colors">Audiovisuales &amp; Pantallas</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Pantallas LED P2.9 para retransmisiones, cine de verano, microfonía inalámbrica para pregones y sonorización de espacios.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-4 flex items-center gap-1 font-bold">
                Equipamiento B2G <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </div>

        {/* INYECCIÓN DEL COMPONENTE DE FAQ Y SCHEMA ORG */}
        <B2GGovFaqAccordion />

        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block mb-2">
                Simulador Administrativo
              </span>
              <h2 className="text-2xl font-fraunces font-bold text-white uppercase">
                Estimador de Tramitación Municipal
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-2 font-mono">
                  <span>Población del Municipio</span>
                  <span className="text-[#ecb613] font-bold">{population.toLocaleString('es-ES')} Habitantes</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="50000" 
                  step="500" 
                  value={population}
                  onChange={(e) => setPopulation(Number(e.target.value))}
                  className="w-full accent-[#ecb613]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFormat('menor')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedFormat === 'menor' 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] text-white' 
                      : 'bg-black/40 border-white/5 text-white/40'
                  }`}
                >
                  <span className="block font-bold text-sm mb-1">Contrato Menor (Art. 118)</span>
                  <span className="text-[10px] font-mono text-white/50">Hasta 15.000€ + IVA • Adjudicación Directa</span>
                </button>
                <button
                  onClick={() => setSelectedFormat('licitacion')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedFormat === 'licitacion' 
                      ? 'bg-blue-500/10 border-blue-500 text-white' 
                      : 'bg-black/40 border-white/5 text-white/40'
                  }`}
                >
                  <span className="block font-bold text-sm mb-1">Licitación Abierta</span>
                  <span className="text-[10px] font-mono text-white/50">Proyectos Macro (&gt;15.000€) • Pliego Técnico</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-white/40 uppercase font-mono">Estimación de Presupuesto</span>
              <div className="text-4xl font-black text-white font-fraunces">
                {estimatedBudget.toLocaleString('es-ES')} € <span className="text-xs text-white/40 font-normal">+ IVA</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="https://wa.me/34693693048?text=Hola,%20solicito%20presupuesto%20para%20Ayuntamiento"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-xs rounded-xl transition-colors flex items-center justify-center gap-2 font-bold"
              >
                <PhoneCall size={16} /> Contactar con Secretaría Técnica
              </a>
              <Link 
                href="/checkout/presupuesto"
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Abrir Cotizador Avanzado 360°
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8">
          <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-6">
            Garantías Administrativas Auditoras (Inspeccionar Documentación)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Póliza RC 1M€</h4>
              <p className="text-xs text-white/50">Cobertura civil en vías e instalaciones públicas.</p>
            </Link>

            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <FileText className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Factura en FACe</h4>
              <p className="text-xs text-white/50">Tramitación con códigos DIR3 de la Intervención.</p>
            </Link>

            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <Zap className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Certificados TC1/TC2</h4>
              <p className="text-xs text-white/50">Corriente de pago en TGSS y Agencia Tributaria.</p>
            </Link>

            <Link 
              href="/soberania-tecnica" 
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <Download className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Memorias Técnicas</h4>
              <p className="text-xs text-white/50">Documentación redactada para mesas de contratación.</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
