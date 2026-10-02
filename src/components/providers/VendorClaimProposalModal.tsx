'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  X,
  Target,
  Zap,
  ArrowRight,
  Lock,
  HeartHandshake,
  MessageCircle,
  KeyRound
} from 'lucide-react';
import { ClaimProviderModal } from './ClaimProviderModal';

interface VendorClaimProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    name: string;
    slug?: string;
    category?: string;
    province?: string;
    phone?: string;
  } | null;
}

export const VendorClaimProposalModal: React.FC<VendorClaimProposalModalProps> = ({
  isOpen,
  onClose,
  provider
}) => {
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  if (!isOpen || !provider) return null;

  const cleanName = (provider.name || '')
    .replace(/Restáaurante/gi, 'Restaurante')
    .replace(/Restáurante/gi, 'Restaurante');

  const categoryTitle = provider.category || 'Servicios Homologados S-Class';
  const locationTitle = (provider.province || 'España').split(',')[0];

  const whatsappText = encodeURIComponent(
    `¡Hola Concierge de Productora EAR! Soy el titular / dirección de ${cleanName} (${locationTitle}). ` +
    `Deseo acreditar mi tarifa histórica actual y activar la propuesta executive de 126 Landings con Garantía ROI.`
  );
  const whatsappUrl = `https://wa.me/34693693048?text=${whatsappText}`;

  const PROMISES = [
    {
      num: '01',
      title: 'Red Masiva Propietaria de 126 Landings Dedicadas',
      description: `Mientras un sitio web convencional solo dispone de 3 a 5 páginas, en EAR OS desplegamos y mantenemos exactamente 126 landing pages dedicadas (72 GEO Hyper-Locales en 18 municipios + 54 Niche Long-Tail SEO + 1 Malla GEO AI) para captar clientes de alto presupuesto en ${locationTitle} y dominar el #1 de Google y ChatGPT.`,
      badge: 'Red Propietaria 126 Landings',
      highlight: '126 Landings Exclusivas + GEO AI Schema.org'
    },
    {
      num: '02',
      title: 'Tarifa Acreditada + 10% Comisión en Producción & Sonido',
      description: `El proveedor acredita su cuota histórica y la congelamos al 0% de subidas por contrato con Garantía ROI. Además, percibe un 10% de comisión sobre cualquier contratación de sonido (Bose/luces), producción o música realizada en sus instalaciones. El saldo acumulado se puede descontar de la cuota anual del siguiente ejercicio, abonarse en cuenta o canjearse por actuaciones exclusivas (ej. Edwin Agudelo) abonando únicamente los costes logísticos de desplazamiento, dietas y hotel.`,
      badge: 'Tarifa Histórica + 10% Comisión',
      highlight: 'Saldo canjeable en cuota futura, abono directo o actuaciones exclusivas'
    },
    {
      num: '03',
      title: 'Fianza de 100 € Stripe Price-Lock (100% Canjeable)',
      description: `Erradicamos las visitas perdidas y solicitudes vacías. Cada cliente formaliza un depósito fiduciario de 100 € retenido con firma SHA-256. Este importe es 100% deducible de la reserva final o canjeable in situ durante la visita para la prueba de menú, degustación o servicios extras del proveedor.`,
      badge: 'Fianza 100% Canjeable',
      highlight: '100% Deducible en reserva o canjeable en servicios extras'
    },
    {
      num: '04',
      title: 'Supervisión Técnica & Audiovisuales Opcionales S-Class',
      description: `Si los novios o clientes requieren sonorización profesional, iluminación o artista de nuestro roster, Productora EAR aporta e instala el rider (Bose F1 / Shure 12 W/pax) y la Póliza de RC de 1.000.000 € al contratarlo como extra a través de la plataforma, liberando a la propiedad de cualquier complicación técnica.`,
      badge: 'Audiovisuales & RC Opcionales',
      highlight: 'Producción técnica y seguro de RC contratables como extra'
    },
    {
      num: '05',
      title: 'Certificado RSC & Deducción Fiscal de hasta el 80% (Ley 49/2002)',
      description: `El 10% del split financia talleres de neuro-musicoterapia 40 Hz para nuestros mayores en residencias senior de ${locationTitle}. El proveedor recibe un certificado oficial RSC deducible hasta el 80% en IRPF o 50% en Impuesto de Sociedades (Modelo 182 AEAT).`,
      badge: 'Fondo VIMUME (Ley 49/2002)',
      highlight: 'Deducción fiscal directa (Modelo 182 AEAT)'
    },
    {
      num: '06',
      title: 'Autonomía de Gestión Soberana & Exclusividad Territorial',
      description: `Mantiene la independencia y control absoluto sobre sus tarifas, cartas, productos y servicios. EAR OS actúa como motor tecnológico invisible sin interferir en la gestión ni operativa interna de su empresa.`,
      badge: 'Soberanía Empresarial',
      highlight: 'Control total de la dirección de la empresa'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-5xl bg-[#09090f] border-2 border-[#ecb613]/50 rounded-[2.5rem] p-6 sm:p-10 relative my-8 shadow-[0_0_100px_rgba(236,182,19,0.2)] text-white"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="space-y-4 mb-8 relative z-10 border-b border-white/10 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 bg-[#ecb613]/20 border border-[#ecb613]/50 text-[#ecb613] text-xs font-mono font-bold uppercase rounded-full flex items-center gap-1.5 shadow-md">
                <Sparkles size={14} /> DOSSIER DE GARANTÍA EJECUTIVA S-CLASS 2026
              </span>
              <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-full">
                Hub {locationTitle} · Exclusividad Homologada
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight leading-tight">
              Propuesta de Aceleración y Garantía ROI para <span className="text-[#ecb613]">{cleanName}</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl font-light">
              Transformamos la cuota pasiva de los portales tradicionales en un <strong className="text-white">Motor de Aceleración Cuántica de 126 Landing Pages Exclusivas Dedicadas</strong> en {locationTitle}, con <strong className="text-[#ecb613]">Garantía por Contrato de Retorno 100% de la Inversión</strong>.
            </p>
          </div>

          {/* Malla de 6 Promesas */}
          <div className="space-y-6 relative z-10 mb-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ecb613] font-bold flex items-center gap-2">
                <Target size={16} /> Las 6 Promesas Garantizadas por Contrato
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                100% Garantizadas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROMISES.map((p) => (
                <div
                  key={p.num}
                  className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group hover:bg-[#0d0d14]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <span className="w-7 h-7 rounded-xl bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold flex items-center justify-center shadow-md">
                        {p.num}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/10">
                        {p.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white font-syne group-hover:text-[#ecb613] transition-colors leading-snug">
                      {p.title}
                    </h4>

                    <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                    <CheckCircle2 size={12} className="shrink-0" />
                    <span>{p.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10 relative z-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ecb613] via-amber-500 to-amber-600 hover:from-amber-400 hover:to-[#ecb613] text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60 hover:scale-[1.02] transition-all text-center cursor-pointer"
            >
              <Zap size={16} />
              <span>Aceptar Propuesta & Activar 126 Landings con Garantía ROI</span>
              <ArrowRight size={16} />
            </a>

            <button
              onClick={() => setIs2FAModalOpen(true)}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound size={16} />
              <span>Reclamar Ficha vía Verificación 2FA</span>
            </button>
          </div>

          {/* Footer Legal */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500 pt-4 border-t border-white/5 mt-4 relative z-10">
            <span>Garantía de Soberanía Empresarial Productora EAR · Split 80/10/10 Inmutable</span>
            <span>LSSI Art. 16 · RGPD Art. 6.1.f</span>
          </div>
        </motion.div>
      </div>

      {/* Modal 2FA de Reclamación Integrado */}
      <ClaimProviderModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        provider={provider}
        onClaimSuccess={() => {
          setIs2FAModalOpen(false);
          onClose();
        }}
      />
    </AnimatePresence>
  );
};
