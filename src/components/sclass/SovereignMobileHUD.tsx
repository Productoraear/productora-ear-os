'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  MessageCircle, 
  X, 
  Zap, 
  Building2, 
  Users, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  Lock,
  ChevronRight,
  Music,
  Compass
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

type MobileRole = 'B2G' | 'B2C' | 'ARTISTA' | 'PROVIDER';

interface RoleInsight {
  title: string;
  badge: string;
  badgeColor: string;
  ticket: string;
  split: string;
  summary: string;
  keyAction: string;
  actionHref: string;
}

const ROLE_INSIGHTS: Record<MobileRole, RoleInsight> = {
  B2G: {
    title: "Instituciones & FITUR 2026",
    badge: "Contrato Menor Art. 118 LCSP",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ticket: "< 14.250 € (Sin Concurso)",
    split: "E-Manager + 8 Mentorías Diáspora",
    summary: "Rider técnico homologado Bose F1 (<75 dB SPL) para recepciones oficiales y formación gratuita a 2 artistas locales como embajadores culturales.",
    keyAction: "Ver Protocolo B2G FITUR",
    actionHref: "/oraculo"
  },
  B2C: {
    title: "Parejas & Bodas S-Class",
    badge: "Solista Edwin Agudelo",
    badgeColor: "bg-[#ecb613]/20 text-[#ecb613] border-[#ecb613]/30",
    ticket: "Desde 350,00 € Base",
    split: "Split Soberano 80/10/10",
    summary: "Sonorización profesional Bose F1 y microfonía inalámbrica incluidas. Bloqueo de fecha inmediato con depósito de 100 € en Stripe.",
    keyAction: "Cotizar Presupuesto Exacto",
    actionHref: "/checkout/presupuesto"
  },
  ARTISTA: {
    title: "Artistas & Roster Diáspora",
    badge: "Gobernanza Soberana",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    ticket: "Split 80% Artista Directo",
    split: "10% EAR OS / 10% VIMUME",
    summary: "Protección contra intermediarios abusivos. Asignación de backline Shure Beta 87A / Axient y acceso al programa de mentorías de alta proyección.",
    keyAction: "Consultar Condiciones Roster",
    actionHref: "/artistas"
  },
  PROVIDER: {
    title: "Fincas & Proveedores de Red",
    badge: "Red Territorial 11.690 Fincas",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ticket: "10% Comisión Transparente",
    split: "Póliza RC 1.000.000 €",
    summary: "Sincronización técnica directa con organizadores de bodas y consistorios. Cero cancelaciones con garantía de sustitución <2 horas.",
    keyAction: "Unirse a la Red Homologada",
    actionHref: "/arsenal"
  }
};

export function SovereignMobileHUD() {
  const [isCockpitOpen, setIsCockpitOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<MobileRole>('B2C');
  const [paxCount, setPaxCount] = useState<number>(120);
  const router = useRouter();
  const pathname = usePathname();

  // Si estamos en /admin, el HUD público no debe interferir con el Centro de Mando
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const activeInsight = ROLE_INSIGHTS[selectedRole];
  const acousticWatts = paxCount * 12; // 12 W/pax SSOT

  const sheetVariants: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', damping: 28, stiffness: 260 }
    },
    exit: { 
      y: '100%', 
      opacity: 0, 
      transition: { duration: 0.2 }
    }
  };

  const handleOpenConciergeChat = () => {
    setIsCockpitOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-ai-concierge'));
    }
  };

  const officialWhatsAppUrl = `https://wa.me/34693693048?text=${encodeURIComponent(
    `Hola Edwin, te escribo desde el Cockpit Móvil de Productora EAR para consultar disponibilidad y presupuesto como perfil ${selectedRole}.`
  )}`;

  return (
    <>
      {/* TELÓN DE FONDO GLASSMORPHIC */}
      <AnimatePresence>
        {isCockpitOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCockpitOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[990] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* CONTENEDOR FLOTANTE MÓVIL (ANCLADO AL BOTTOM CON SAFE-AREA) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-lg z-[995] flex flex-col justify-end pointer-events-none md:hidden">
        
        {/* DRAWER / COCKPIT ACOMPAÑANTE ASTRA (MOMENTO WOW DEL VIAJE DEL CLIENTE) */}
        <AnimatePresence>
          {isCockpitOpen && (
            <motion.div
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full bg-[#07070b]/98 border border-[#ecb613]/30 rounded-3xl p-5 mb-3 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(236,182,19,0.15)] pointer-events-auto flex flex-col gap-4 max-h-[82vh] overflow-y-auto no-scrollbar"
            >
              {/* HEADER DEL COCKPIT */}
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-widest">
                      ASTRA NEURAL COPILOT · V4.1
                    </span>
                  </div>
                  <h2 className="text-lg font-syne font-black text-white uppercase tracking-tight">
                    Tu Viaje <span className="text-[#ecb613]">100% Asistido</span>
                  </h2>
                </div>
                <button 
                  onClick={() => setIsCockpitOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
                  aria-label="Cerrar Cockpit"
                >
                  <X size={18} />
                </button>
              </div>

              {/* SELECTOR INMEDIATO DE ROL (4 ARQUETIPOS EN 1 VISTAZO) */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                  1. Selecciona tu perfil de acceso:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['B2G', 'B2C', 'ARTISTA', 'PROVIDER'] as MobileRole[]).map((r) => {
                    const isSelected = selectedRole === r;
                    const labels: Record<MobileRole, { name: string; icon: any }> = {
                      B2G: { name: 'FITUR B2G', icon: Building2 },
                      B2C: { name: 'Bodas', icon: Users },
                      ARTISTA: { name: 'Artistas', icon: Music },
                      PROVIDER: { name: 'Fincas', icon: Compass }
                    };
                    const ItemIcon = labels[r].icon;
                    return (
                      <button
                        key={r}
                        onClick={() => setSelectedRole(r)}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 border text-center transition-all ${
                          isSelected
                            ? 'bg-[#ecb613]/20 border-[#ecb613] text-white shadow-md'
                            : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <ItemIcon size={14} className={isSelected ? 'text-[#ecb613]' : 'text-zinc-400'} />
                        <span className="text-[10px] font-mono font-bold leading-tight">{labels[r].name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TARJETA DINÁMICA DEL MOMENTO DEL VIAJE */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e0e18] to-[#0a0a10] border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeInsight.badgeColor}`}>
                    {activeInsight.badge}
                  </span>
                  <span className="text-[10px] font-mono text-[#ecb613] font-bold">
                    {activeInsight.ticket}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-syne">
                    {activeInsight.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                    {activeInsight.summary}
                  </p>
                </div>

                {/* BARRA DEL VIAJE DEL CLIENTE EN 4 HITOS */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                    <span>1. Activo & Rider</span>
                    <span>2. Tarifa SSOT</span>
                    <span>3. Oráculo</span>
                    <span className="text-emerald-400 font-bold">4. Cierre 100€</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ecb613] via-amber-400 to-emerald-400 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* CALCULADORA RÁPIDA DE ASISTENTES & PRESIÓN ACÚSTICA (12 W/PAX) */}
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold">
                    <Volume2 size={13} className="text-[#ecb613]" />
                    <span>Presión Acústica S-Class</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    {paxCount} pax = <span className="text-[#ecb613] font-bold">{acousticWatts} W</span> (Bose F1 Homologado)
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#12121c] p-1 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setPaxCount(Math.max(20, paxCount - 20))}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white font-mono text-xs flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs font-bold text-white px-1.5">{paxCount}</span>
                  <button 
                    onClick={() => setPaxCount(paxCount + 20)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white font-mono text-xs flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ACCIONES EJECUTIVAS 1-TAP */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleOpenConciergeChat}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-black uppercase text-[11px] font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Sparkles size={14} />
                  <span>Hablar con IA</span>
                </button>

                <button
                  onClick={() => {
                    setIsCockpitOpen(false);
                    router.push(activeInsight.actionHref);
                  }}
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[11px] font-mono border border-white/10 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>{activeInsight.keyAction.split(' ')[0]} {activeInsight.keyAction.split(' ')[1] || 'Directo'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* BOTÓN DIRECTO WHATSAPP VIP / RETENCIÓN (+34 693 693 048) */}
              <a
                href={officialWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-[11px] font-mono font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone size={13} />
                <span>Atención Oficial: +34 693 693 048</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🚀 BARRA DE NAVEGACIÓN INFERIOR S-CLASS (AEROESPACIAL · CERO RUIDO · ERGONÓMICA) */}
        <nav 
          aria-label="Navegación Móvil Principal"
          className="w-full h-15 bg-[#06060a]/92 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center justify-between px-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] pointer-events-auto"
        >
          {/* 1. INICIO / EXPLORAR */}
          <button 
            onClick={() => router.push('/')}
            className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 transition-colors ${
              pathname === '/' ? 'text-[#ecb613]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Ir a Inicio"
          >
            <Home size={18} />
            <span className="text-[9px] font-mono font-medium">Inicio</span>
          </button>
          
          {/* 2. COTIZADOR EXPRESS */}
          <button 
            onClick={() => router.push('/checkout/presupuesto')}
            className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 transition-colors ${
              pathname?.startsWith('/checkout') ? 'text-[#ecb613]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Calcular Presupuesto"
          >
            <Calculator size={18} />
            <span className="text-[9px] font-mono font-medium">Cotizar</span>
          </button>

          {/* 3. BOTÓN CENTRAL WOW: ORÁCULO ASTRA ACOMPAÑANTE */}
          <button 
            onClick={() => setIsCockpitOpen(!isCockpitOpen)}
            className="relative -top-4 w-13 h-13 rounded-full bg-gradient-to-tr from-[#ecb613] via-amber-400 to-[#fff2a3] flex items-center justify-center text-black border-4 border-[#06060a] shadow-[0_0_25px_rgba(236,182,19,0.6)] active:scale-90 transition-all group"
            aria-label="Abrir Oráculo Copilot"
            title="Oráculo Astra Copilot"
          >
            <motion.div 
              animate={{ 
                rotate: isCockpitOpen ? 90 : 0,
                scale: isCockpitOpen ? 0.9 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Sparkles size={22} className="text-black" />
            </motion.div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black animate-pulse"></span>
          </button>

          {/* 4. GARANTÍA & B2G */}
          <button 
            onClick={() => router.push('/ocasiones/ayuntamientos')}
            className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 transition-colors ${
              pathname?.startsWith('/ocasiones') ? 'text-[#ecb613]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Garantía y Contratación"
          >
            <ShieldCheck size={18} />
            <span className="text-[9px] font-mono font-medium">Garantía</span>
          </button>

          {/* 5. WHATSAPP VIP / ORÁCULO DIRECTO */}
          <a 
            href={officialWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            aria-label="Contactar por WhatsApp Oficial"
          >
            <MessageCircle size={18} />
            <span className="text-[9px] font-mono font-medium">Directo</span>
          </a>
        </nav>
      </div>
    </>
  );
}

export default SovereignMobileHUD;
