'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import { B2GMemoryGenerator } from '@/features/b2g/ui/B2GMemoryGenerator';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Award, 
  Zap, 
  Landmark, 
  Users2, 
  ArrowRight, 
  PhoneCall,
  Sliders
} from 'lucide-react';
import Link from 'next/link';
import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';

type InstType = 'gobiernos' | 'ayuntamientos' | 'fundaciones';

export default function AyuntamientosB2GPage() {
  const [selectedInst, setSelectedInst] = useState<InstType>('ayuntamientos');
  const { openTunnel } = useNeuralTunnelStore();

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-40 px-4 md:px-8 selection:bg-[#06b6d4] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HERO SECTION INSTITUCIONAL */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-[10px] font-mono uppercase tracking-[0.3em]">
            <Building2 size={12} />
            PORTAL INSTITUCIONAL B2G // GOBIERNO, MUNICIPIOS & TERCER SECTOR
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[1.02]">
            Instituciones & <span className="text-[#06b6d4] italic">Sector Público</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            Pliegos técnicos homologados, cobertura acústica calibrada a 12 W/pax, seguros de RC por 1.000.000 € y facturación electrónica FacturaE (DIR3) para Administraciones Públicas y Fundaciones.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => openTunnel()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-black font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:scale-105 transition-all cursor-pointer"
            >
              <Sliders size={15} />
              <span>Configurar en Túnel Neural B2G</span>
            </button>
            <a
              href="tel:+34693693048"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-mono uppercase tracking-wider transition-all"
            >
              <PhoneCall size={14} className="text-[#06b6d4]" />
              <span>Gabinete Técnico: +34 693 693 048</span>
            </a>
          </div>
        </div>

        {/* SELECTOR INTERACTIVO DE 3 NIVELES INSTITUCIONALES */}
        <div className="p-1.5 bg-[#0b0c13] border border-white/10 rounded-2xl max-w-3xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedInst('gobiernos')}
              className={`px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                selectedInst === 'gobiernos'
                  ? 'bg-[#06b6d4] text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Landmark size={15} />
              <span>1. Gobiernos</span>
            </button>

            <button
              onClick={() => setSelectedInst('ayuntamientos')}
              className={`px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                selectedInst === 'ayuntamientos'
                  ? 'bg-[#06b6d4] text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 size={15} />
              <span>2. Ayuntamientos</span>
            </button>

            <button
              onClick={() => setSelectedInst('fundaciones')}
              className={`px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                selectedInst === 'fundaciones'
                  ? 'bg-[#06b6d4] text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users2 size={15} />
              <span>3. Fundaciones</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO SEGÚN PERFIL INSTITUCIONAL SELECCIONADO */}
        <div className="bg-[#090a10] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          {selectedInst === 'gobiernos' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-syne text-white uppercase">
                    Gobiernos Estatales, Comunidades Autónomas & Diputaciones
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Grandes planes de dinamización cultural, convenios marco y despliegue de fondos europeos.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-zinc-300">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Circuitos Regionales</div>
                  <p>Coordinación de giras artísticas multisede con logística centralizada desde Hub Méntrida.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Fondos NextGenerationEU</div>
                  <p>Planes de resiliencia y envejecimiento activo mediante el protocolo VIMUME comarcal.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Seguridad Jurídica Total</div>
                  <p>Seguros de RC de 1.000.000 €, pliegos técnicos certificados y cumplimiento estricto LCSP.</p>
                </div>
              </div>
            </div>
          )}

          {selectedInst === 'ayuntamientos' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-syne text-white uppercase">
                    Ayuntamientos & Concejalías de Festejos
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Contratos menores Art. 118 LCSP (&lt; 15.000 €). Presupuesto sugerido preventivo al 95% (14.250 €).
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-zinc-300">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Fiestas Patronales</div>
                  <p>Escenarios móviles, orquestas de gala y Mariachi imperial con sonorización Bose F1 12 W/pax.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">FacturaE y Código DIR3</div>
                  <p>Emisión y despacho inmediato en plataforma FACe conforme a la normativa tributaria local.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Día del Mayor Municipal</div>
                  <p>Espectáculos de música del recuerdo especialmente diseñados para plazas de pueblos y centros cívicos.</p>
                </div>
              </div>
            </div>
          )}

          {selectedInst === 'fundaciones' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
                  <Users2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-syne text-white uppercase">
                    Fundaciones, Tercera Edad & Asociaciones Culturales
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Acuerdos de afiliación, subvenciones del IRPF y proyectos de voluntariado e impacto social.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-zinc-300">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Proyecto VIMUME 40Hz</div>
                  <p>Convenios con residencias y centros de Alzheimer con control estricto &lt; 75 dB SPL.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Subvenciones IRPF</div>
                  <p>Memorias justificativas de impacto social para la obtención de ayudas públicas y privadas.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="font-bold text-white uppercase font-mono text-[#06b6d4]">Red de Afiliados</div>
                  <p>Convenios solidarios y actividades comunitarias intergeneracionales con certificación de impacto.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COMPILADOR DE MEMORIAS B2G ART. 118 LCSP */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono text-[#06b6d4] uppercase tracking-[0.3em] font-bold">
              MOTOR DE DESPACHO INMEDIATO // TENDER COMPILER
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
              Generador de Memoria <span className="text-[#06b6d4]">Art. 118 LCSP</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Compila en 1 clic el informe de necesidad, código DIR3, desglose económico al 95% del techo y certificación técnica para tu expediente.
            </p>
          </div>

          <B2GMemoryGenerator />
        </section>

      </div>
    </main>
  );
}
