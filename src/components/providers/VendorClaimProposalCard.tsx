'use client';

import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Lock, Award, TrendingUp, HeartHandshake, Target, Zap, Volume2, ShieldAlert, AwardIcon } from 'lucide-react';
import { ClaimProfileTrigger } from './ClaimProfileTrigger';

interface VendorClaimProposalCardProps {
  provider: {
    id: string;
    name: string;
    slug: string;
    category: string;
    province: string;
    phone?: string;
  };
}

export const VendorClaimProposalCard: React.FC<VendorClaimProposalCardProps> = ({ provider }) => {
  const cleanName = (provider.name || '')
    .replace(/Restáaurante/gi, 'Restaurante')
    .replace(/Restáurante/gi, 'Restaurante');

  const whatsappText = encodeURIComponent(
    `¡Hola Concierge de Productora EAR! Soy Eduardo / Dirección de ${cleanName}. ` +
    `Deseo activar la propuesta executive con las 6 garantías de aceleración en ${provider.province} y solicitar el Dossier 2026.`
  );
  const whatsappUrl = `https://wa.me/34693693048?text=${whatsappText}`;

  const PROMISES = [
    {
      num: 1,
      title: 'Red Masiva Propietaria de 126 Landings Dedicadas',
      description: `Mientras su web actual dispone de entre 3 y 5 páginas, en EAR OS desplegamos y mantenemos exactamente 126 landing pages dedicadas (72 GEO Hyper-Locales en 18 municipios + 54 Niche Long-Tail SEO + 1 Malla GEO AI) para captar novios de alto presupuesto y dominar el #1 de Google y ChatGPT.`,
      highlight: '126 Landings Exclusivas + GEO AI Schema.org',
      badge: 'Red Propietaria 126 Landings'
    },
    {
      num: 2,
      title: 'Misma Tarifa de tu Histórico Actual · Congelada Sin Subidas',
      description: `El proveedor simplemente nos acredita el importe que venía abonando en su portal actual en los últimos ejercicios. Productora EAR iguala esa tarifa y la congela por contrato al 0% de subidas de por vida, sustituyendo la cuota pasiva por un Contrato con Garantía de Retorno 100% de la Inversión.`,
      highlight: 'Igualación de tarifa histórica acreditada (0% subidas)',
      badge: 'Tarifa Histórica Acreditada'
    },
    {
      num: 3,
      title: 'Fianza de 100 € Stripe Price-Lock (100% Canjeable en Prueba de Menú o Extras)',
      description: `Erradicamos las visitas perdidas. Cada novio formaliza un depósito de 100 € retenido con firma SHA-256. Este importe es 100% deducible de la reserva del banquete o canjeable in situ durante la visita para la prueba de menú, recena o servicios extras que Eduardo les ofrezca.`,
      highlight: '100% Deducible en banquete o canjeable en prueba de menú/extras',
      badge: 'Fianza 100% Canjeable'
    },
    {
      num: 4,
      title: 'Supervisión Técnica & Audiovisuales Opcionales S-Class',
      description: `Si los novios requieren sonorización profesional o artista de nuestro roster, Productora EAR aporta e instala el rider (Bose F1 / Shure 12 W/pax) y la Póliza de RC de 1.000.000 € al contratarlo como extra a través de la plataforma, liberando a la propiedad de cualquier complicación técnica.`,
      highlight: 'Producción técnica y seguro de RC contratables como extra',
      badge: 'Audiovisuales & RC Opcionales'
    },
    {
      num: 5,
      title: 'Certificado RSC & Deducción Fiscal de hasta el 80% (Ley 49/2002)',
      description: `El 10% del split financia talleres de neuro-musicoterapia 40 Hz para nuestros mayores en residencias senior de Gipuzkoa. El caserío recibe un certificado oficial RSC deducible hasta el 80% en IRPF o 50% en Sociedades.`,
      highlight: 'Deducción fiscal directa (Modelo 182 AEAT)',
      badge: 'Fondo VIMUME (Ley 49/2002)'
    },
    {
      num: 6,
      title: 'Autonomía Gastronómica Soberana & Exclusividad #1 en Gipuzkoa',
      description: `Eduardo mantiene la independencia y control absoluto sobre menús, parrillada de chuletón, bodegas y tarifas de comensal. EAR OS actúa como motor tecnológico invisible sin interferir en la cocina del caserío.`,
      highlight: 'Control total de la dirección del restaurante',
      badge: 'Soberanía Empresarial'
    }
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0e0e18] via-[#09090f] to-black border-2 border-[#ecb613]/60 p-6 sm:p-10 space-y-8 shadow-[0_20px_90px_rgba(236,182,19,0.2)] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 bg-[#ecb613]/20 border border-[#ecb613]/50 text-[#ecb613] text-xs font-mono font-bold uppercase rounded-full flex items-center gap-1.5 shadow-md">
            <Sparkles size={14} /> DOSSIER DE GARANTÍA EJECUTIVA S-CLASS 2026
          </span>
          <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-full">
            Gipuzkoa Hub #1 · Atención Preferente
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-400">Exclusivamente para Eduardo & Dirección</span>
      </div>

      {/* Main Pitch */}
      <div className="space-y-3 relative z-10">
        <h3 className="text-2xl sm:text-4xl font-black font-syne text-white tracking-tight leading-tight">
          Propuesta de Aceleración y Garantía ROI para <span className="text-[#ecb613]">{cleanName}</span>
        </h3>
        <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-4xl font-light">
          A diferencia de los portales tradicionales que cobran cuotas anuales pasivas sin compromiso de contrataciones, <strong className="text-white">Productora EAR OS</strong> transforma esa misma inversión en un <strong className="text-[#ecb613]">Cluster de Landings Dedicadas y Reservas Directas Garantizadas con Fianza</strong>.
        </p>
      </div>

      {/* Grid de las 6 Promesas Garantizadas */}
      <div className="space-y-5 relative z-10 pt-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ecb613] font-bold flex items-center gap-2">
            <Target size={16} /> Las 6 Promesas Garantizadas para Restaurante Ezkertza Berria
          </h4>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            100% Garantizadas por Contrato
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROMISES.map((p) => (
            <div
              key={p.num}
              className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-3 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group hover:bg-[#0d0d14]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-sm font-mono font-bold flex items-center justify-center shadow-md">
                    0{p.num}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/10">
                    {p.badge}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-white font-syne group-hover:text-[#ecb613] transition-colors leading-snug">
                  {p.title}
                </h5>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>{p.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 relative z-10">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex-1 py-4.5 px-6 rounded-2xl bg-gradient-to-r from-[#ecb613] via-amber-500 to-amber-600 hover:from-amber-400 hover:to-[#ecb613] text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60 hover:scale-[1.02] transition-all text-center cursor-pointer"
        >
          <Zap size={16} />
          <span>Aceptar Propuesta & Generar Cluster de Landings 2026</span>
          <ArrowRight size={16} />
        </a>

        <div className="w-full sm:w-auto shrink-0">
          <ClaimProfileTrigger provider={{ ...provider, name: cleanName }} />
        </div>
      </div>

      {/* Footer Legal */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500 pt-3 border-t border-white/10 relative z-10">
        <span>Garantía de Soberanía Empresarial Productora EAR · Split 80/10/10 Inmutable</span>
        <span>LSSI Art. 16 · RGPD Art. 6.1.f</span>
      </div>
    </div>
  );
};
