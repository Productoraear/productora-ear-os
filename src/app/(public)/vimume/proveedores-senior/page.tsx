'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, HeartHandshake, Phone, ArrowRight, Building, 
  Activity, Headphones, Calculator, Award, CheckCircle2, TrendingUp, Send, FileCheck, Layers
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export const DEDUCCION_FISCAL_RATE = 0.35; // 35% de deducción en Impuesto de Sociedades (Ley 49/2002)

export default function VimumeProveedoresSeniorPage() {
  // Estado para Calculador de Co-Branding & Patrocinio
  const [numCentros, setNumCentros] = useState<number>(3);
  const [kitTier, setKitTier] = useState<'basico' | 'avanzado' | 'integral'>('avanzado');
  const [empresaNombre, setEmpresaNombre] = useState<string>('');
  const [empresaEmail, setEmpresaEmail] = useState<string>('');

  // Estado para Formulario de Homologación de Dispositivos
  const [techEmpresa, setTechEmpresa] = useState<string>('');
  const [techCategoria, setTechCategoria] = useState<string>('audio');
  const [techSpecs, setTechSpecs] = useState<string>('');
  const [techContact, setTechContact] = useState<string>('');
  const [homologacionSent, setHomologacionSent] = useState<boolean>(false);

  // Cálculos SROI y Financieros
  const costeUnitarioKit = useMemo(() => {
    if (kitTier === 'basico') return 1200; // Kit Auriculares + Tablet
    if (kitTier === 'avanzado') return 2500; // Kit Shure + Procesador 40Hz
    return 4800; // Kit Integral + Sesiones Presenciales
  }, [kitTier]);

  const inversionTotal = useMemo(() => {
    return numCentros * costeUnitarioKit;
  }, [numCentros, costeUnitarioKit]);

  const vidasImpactadas = useMemo(() => {
    // Estimación de 35 usuarios por residencia en 3 meses
    return numCentros * 35;
  }, [numCentros]);

  const deduccionFiscal = useMemo(() => {
    return Math.round(inversionTotal * DEDUCCION_FISCAL_RATE);
  }, [inversionTotal]);

  const costeNetoEmpresa = useMemo(() => {
    return inversionTotal - deduccionFiscal;
  }, [inversionTotal, deduccionFiscal]);

  const handleSponsorshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola Productora EAR / VIMUME, represento a la empresa "${empresaNombre || 'Sponsor Silver Economy'}". Deseamos apadrinar ${numCentros} centros con el Kit ${kitTier.toUpperCase()} (Inversión: ${inversionTotal}€ / Vidas: ${vidasImpactadas}). Contacto: ${empresaEmail}.`;
    window.open(`${CENTRALITA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleHomologacionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHomologacionSent(true);
    const msg = `Hola equipo técnico VIMUME, solicitamos homologación de dispositivo de salud para la empresa "${techEmpresa}". Categoría: ${techCategoria}. Especificaciones: ${techSpecs}. Contacto: ${techContact}.`;
    window.open(`${CENTRALITA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-4 max-w-7xl mx-auto selection:bg-[#ecb613] selection:text-black">
      {/* Header Editorial */}
      <div className="space-y-4 mb-14 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase">
          <HeartHandshake size={14} className="text-[#ecb613]" />
          <span>VIMUME // MARKETPLACE SILVER ECONOMY &amp; CO-BRANDING ESG</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
          Alianzas Silver Economy &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
            Patrocinio de Kits Neuroacústicos
          </span>
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-3xl leading-relaxed font-light">
          Conectamos empresas de audioprótesis, tecnología médica y bienestar con la red de residencias de VIMUME. Rentabilidad ética, co-branding auditado y deducción fiscal de hasta el 35% bajo la Ley 49/2002.
        </p>
      </div>

      {/* Grid de 2 Columnas de Herramientas Interactivas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Columna Izquierda: Calculador de Co-Branding & Patrocinio SROI */}
        <div className="lg:col-span-7 bg-[#0c0c0e] border border-[#ecb613]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#ecb613]/20 text-[#ecb613]">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-syne">Calculador de Co-Branding ESG &amp; SROI</h2>
                  <p className="text-white/50 text-xs">Simulación en tiempo real de impacto social y beneficio fiscal</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold">
                Deducción 35%
              </span>
            </div>

            <form onSubmit={handleSponsorshipSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                    Número de Residencias a Apadrinar
                  </label>
                  <span className="text-xs font-mono font-bold text-[#ecb613]">{numCentros} Centros</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={numCentros}
                  onChange={(e) => setNumCentros(Number(e.target.value))}
                  className="w-full accent-[#ecb613] cursor-pointer h-2 bg-white/10 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5">
                  Nivel de Equipamiento &amp; Co-Branding
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setKitTier('basico')}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-center transition ${
                      kitTier === 'basico'
                        ? 'bg-[#ecb613]/20 border-[#ecb613] text-[#ecb613] font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Kit Básico (1.2k€)
                  </button>
                  <button
                    type="button"
                    onClick={() => setKitTier('avanzado')}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-center transition ${
                      kitTier === 'avanzado'
                        ? 'bg-[#ecb613]/20 border-[#ecb613] text-[#ecb613] font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Kit Shure 40Hz (2.5k€)
                  </button>
                  <button
                    type="button"
                    onClick={() => setKitTier('integral')}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-center transition ${
                      kitTier === 'integral'
                        ? 'bg-[#ecb613]/20 border-[#ecb613] text-[#ecb613] font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Integral + Live (4.8k€)
                  </button>
                </div>
              </div>

              {/* Métricas de Retorno */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-black/60 border border-white/10 rounded-2xl text-center">
                <div>
                  <span className="text-[9px] font-mono uppercase text-white/50 block">Inversión Bruta</span>
                  <span className="text-sm font-bold text-white font-mono">{inversionTotal.toLocaleString()} €</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-white/50 block">Ahorro Fiscal (35%)</span>
                  <span className="text-sm font-bold text-green-400 font-mono">-{deduccionFiscal.toLocaleString()} €</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-white/50 block">Coste Neto Real</span>
                  <span className="text-sm font-bold text-[#ecb613] font-mono">{costeNetoEmpresa.toLocaleString()} €</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-white/50 block">Mayores Alcanzados</span>
                  <span className="text-sm font-bold text-white font-mono">{vidasImpactadas} pax</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Empresa o Marca Patrocinadora"
                  value={empresaNombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                  className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ecb613] placeholder:text-white/30"
                />
                <input
                  type="email"
                  required
                  placeholder="Email de RSC o Marketing"
                  value={empresaEmail}
                  onChange={(e) => setEmpresaEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ecb613] placeholder:text-white/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#ecb613] hover:bg-white text-black font-bold rounded-xl text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition shadow-[0_0_25px_rgba(236,182,19,0.3)]"
              >
                <Award size={14} />
                <span>Solicitar Apadrinamiento Corporativo</span>
              </button>
            </form>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Homologación de Producto */}
        <div className="lg:col-span-5 bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-syne">Homologación de Producto</h2>
                <p className="text-white/50 text-xs">Validación bajo protocolo acústico &lt;75 dB</p>
              </div>
            </div>

            <form onSubmit={handleHomologacionSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Empresa Fabricante / Proveedor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sennheiser Medical / Audika"
                  value={techEmpresa}
                  onChange={(e) => setTechEmpresa(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Categoría del Dispositivo
                </label>
                <select
                  value={techCategoria}
                  onChange={(e) => setTechCategoria(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="audio" className="bg-black text-white">Auriculares / Audioprótesis</option>
                  <option value="domotica" className="bg-black text-white">Domótica Adaptativa & Sensores</option>
                  <option value="estimulacion" className="bg-black text-white">Mobiliario / Estimulación Háptica</option>
                  <option value="software" className="bg-black text-white">Software de Terapia Cognitiva</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Especificaciones Técnicas &amp; SPL
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalles de presión acústica, compatibilidad Bluetooth o ergonomía para mayores..."
                  value={techSpecs}
                  onChange={(e) => setTechSpecs(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 placeholder:text-white/30 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Contacto Técnico / Responsable
                </label>
                <input
                  type="text"
                  required
                  placeholder="Teléfono o Email directo"
                  value={techContact}
                  onChange={(e) => setTechContact(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 placeholder:text-white/30"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <CheckCircle2 size={12} />
                  <span>Sello de Calidad Médica VIMUME:</span>
                </div>
                <p>Tu producto formará parte de los kits recomendados para residencias y centros de día.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white/10 hover:bg-blue-600 hover:text-white text-white font-bold rounded-xl text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition"
              >
                <Send size={13} />
                <span>Enviar Solicitud de Homologación</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tiers de Patrocinio Corporativo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-[#ecb613]/20 text-[#ecb613] rounded-xl w-fit mb-4">
            <Headphones size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tier Plata: Adopta 1 Centro</h3>
          <p className="text-white/60 text-xs leading-relaxed mb-4">
            1.200 € / centro. Entrega de 10 auriculares cerrados y 1 tablet con sello "Powered by [Tu Marca]".
          </p>
          <span className="text-xs font-mono font-bold text-[#ecb613]">Deducción: ~420 € en Sociedades</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl w-fit mb-4">
            <Activity size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tier Oro: Circuito Provincial</h3>
          <p className="text-white/60 text-xs leading-relaxed mb-4">
            3.000 € a 5.000 €. Apadrinamiento de 3 residencias con 12 sesiones presenciales de estimulación 40Hz.
          </p>
          <span className="text-xs font-mono font-bold text-pink-400">Dossier de Impacto ESG para la Memoria Anual</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit mb-4">
            <Building size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tier Platino: Socio Tecnológico</h3>
          <p className="text-white/60 text-xs leading-relaxed mb-4">
            Acuerdo plurianual exclusivo para empresas del sector audiológico y tecnológico con presencia nacional.
          </p>
          <span className="text-xs font-mono font-bold text-blue-400">Co-Branding en Prensa y Congresos Médicos</span>
        </div>
      </div>

      {/* CTA Inferior */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-black p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 font-syne">¿Deseas agendar una reunión de RSC?</h2>
          <p className="text-white/60 text-xs">Evaluamos la integración de tu marca y estructuramos la deducción fiscal de tu donación.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vimume/inversion"
            className="px-6 py-3 bg-[#ecb613] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
          >
            <span>Ver Whitepaper de Inversión</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href={CENTRALITA.whatsapp}
            className="px-6 py-3 border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Phone size={14} />
            <span>Contacto Corporativo</span>
          </a>
        </div>
      </div>
    </main>
  );
}
