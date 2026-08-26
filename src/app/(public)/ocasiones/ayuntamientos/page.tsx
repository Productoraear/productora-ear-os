'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, FileText, ShieldCheck, CheckCircle2, Music, 
  Zap, Download, Award, HeartHandshake, ArrowRight, PhoneCall,
  Sparkles, Users, Gift
} from 'lucide-react';

export default function AyuntamientosPage() {
  const [population, setPopulation] = useState<number>(3500);
  const [selectedFormat, setSelectedFormat] = useState<'menor' | 'licitacion'>('menor');

  // Lógica de estimación presupuestaria LCSP (Art. 118 <15.000€)
  const estimatedBudget = selectedFormat === 'menor' 
    ? Math.min(14900, Math.max(2800, Math.floor(population * 2.1))) 
    : Math.max(18000, Math.floor(population * 3.8));

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* HEADER B2G: COBERTURA PARA +8.000 MUNICIPIOS */}
        <div className="border-b border-white/10 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={14} /> Red de Solvencia B2G (+8.000 Municipios de España)
            </span>
            <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono px-3 py-1 rounded-full uppercase">
              Homologado FACe / DIR3
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full uppercase">
              Contrato Menor (Art. 118 LCSP)
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-fraunces font-black text-white leading-tight max-w-5xl">
            Soluciones Integrales para Ayuntamientos: Fiestas Patronales, Luces de Navidad &amp; Impacto Social
          </h1>
          <p className="mt-4 text-white/60 font-montserrat text-base md:text-lg max-w-3xl leading-relaxed">
            Plataforma unificada de contratación pública para Concejalías de Festejos, Cultura y Asuntos Sociales. Desde infraestructuras de sonido e iluminación festiva hasta programas neuroacústicos para mayores.
          </p>
        </div>

        {/* PACTO DE CONSENSO MUNICIPAL: FESTEJOS + ASUNTOS SOCIALES (VIMUME GRATIS EN EXCLUSIVA) */}
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
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <Award className="text-[#ecb613] shrink-0" size={20} />
                  <span className="text-xs text-white/80 font-bold">Unanimidad entre Festejos, Cultura y Asuntos Sociales</span>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <HeartHandshake className="text-pink-400 shrink-0" size={20} />
                  <span className="text-xs text-white/80 font-bold">Sin sobrecoste para las arcas municipales</span>
                </div>
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
                className="w-full py-3 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-xs rounded-xl transition-colors inline-block"
              >
                Activar Consenso Municipal
              </a>
            </div>

          </div>
        </div>

        {/* CATÁLOGO DE NECESIDADES MUNICIPALES (FIESTAS, LUCES NAVIDEÑAS, SENIORS, SONIDO) */}
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
            
            {/* 1. FIESTAS PATRONALES Y ORQUESTAS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ecb613]">
                  <Music size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white">Fiestas Patronales</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Orquestas de gala, Mariachi Imperial de Edwin Agudelo, grupos de versiones y escenarios móviles con sonido L-Acoustics.
                </p>
              </div>
              <span className="text-[10px] text-[#ecb613] font-mono mt-4 block">Gala &amp; Noche Patronal</span>
            </div>

            {/* 2. ALQUILER DE LUCES DE NAVIDAD Y DECORACIÓN */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white">Luces de Navidad</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Alquiler, diseño e instalación de iluminación festiva LED de bajo consumo para plazas mayores, calles comerciales y fachadas consistoriales.
                </p>
              </div>
              <span className="text-[10px] text-blue-400 font-mono mt-4 block">Campaña Navideña LED</span>
            </div>

            {/* 3. ENTRETENIMIENTO PARA MAYORES */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Users size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white">Espectáculos Senior</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Gala de Copla, Canción Española, Boleros de Autor y homenajes de memoria viva para la Semana de la Tercera Edad.
                </p>
              </div>
              <span className="text-[10px] text-pink-400 font-mono mt-4 block">Día del Mayor &amp; Homenajes</span>
            </div>

            {/* 4. ALQUILER AUDIOVISUAL Y PANTALLAS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap size={22} />
                </div>
                <h3 className="text-lg font-bold font-fraunces text-white">Audiovisuales &amp; Pantallas</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Pantallas LED P2.9 para retransmisiones, cine de verano, microfonía inalámbrica para pregones y sonorización de espacios.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-4 block">Equipamiento B2G</span>
            </div>

          </div>
        </div>

        {/* SIMULADOR DE CONTRATACIÓN PÚBLICA (ART. 118 LCSP) */}
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

            <a
              href="https://wa.me/34693693048?text=Hola,%20solicito%20presupuesto%20para%20Ayuntamiento"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall size={16} /> Contactar con Secretaría Técnica
            </a>
          </div>
        </div>

        {/* GARANTÍA DE SOLVENCIA */}
        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <ShieldCheck className="text-emerald-400" size={28} />
            <h4 className="font-bold text-sm text-white">Póliza RC 1M€</h4>
            <p className="text-xs text-white/50">Cobertura civil en vías e instalaciones públicas.</p>
          </div>
          <div className="space-y-2">
            <FileText className="text-emerald-400" size={28} />
            <h4 className="font-bold text-sm text-white">Factura en FACe</h4>
            <p className="text-xs text-white/50">Tramitación con códigos DIR3 de la Intervención.</p>
          </div>
          <div className="space-y-2">
            <Zap className="text-emerald-400" size={28} />
            <h4 className="font-bold text-sm text-white">Certificados TC1/TC2</h4>
            <p className="text-xs text-white/50">Corriente de pago en TGSS y Agencia Tributaria.</p>
          </div>
          <div className="space-y-2">
            <Download className="text-emerald-400" size={28} />
            <h4 className="font-bold text-sm text-white">Memorias Técnicas</h4>
            <p className="text-xs text-white/50">Documentación redactada para mesas de contratación.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
