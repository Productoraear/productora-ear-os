'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  Calculator,
  ShieldCheck,
  MessageCircle,
  X,
  Building2,
  Users,
  Phone,
  ChevronRight,
  Music,
  Compass,
  Radio,
  FileText,
  Sliders,
  Flame,
} from 'lucide-react';
import { playHapticClick } from '@/lib/audio/AuraAudioSynth';

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
    badgeColor: "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30",
    ticket: "< 14.250 € (Sin Concurso)",
    split: "E-Manager + 8 Mentorías Diáspora",
    summary: "Rider técnico homologado Bose F1 (<75 dB SPL) para recepciones oficiales y festejos con limitador telemático.",
    keyAction: "Ver Protocolo B2G FITUR",
    actionHref: "/b2g"
  },
  B2C: {
    title: "Parejas & Bodas S-Class",
    badge: "Solista Edwin Agudelo",
    badgeColor: "bg-[#ecb613]/20 text-[#ecb613] border-[#ecb613]/30",
    ticket: "Desde 350,00 € Base",
    split: "Split Soberano 80/10/10",
    summary: "Sonorización profesional Bose F1 y microfonía Axient de estudio. Bloqueo de fecha inmediato con depósito deducible.",
    keyAction: "Explorar Tinder Matcher",
    actionHref: "/bodas/parejas"
  },
  ARTISTA: {
    title: "Artistas & Roster Diáspora",
    badge: "Gobernanza Soberana",
    badgeColor: "bg-[#FF2B44]/20 text-[#FF2B44] border-[#FF2B44]/30",
    ticket: "Split 80% Artista Directo",
    split: "10% EAR OS / 10% VIMUME",
    summary: "Protección contra intermediarios abusivos. Asignación de microfonía Shure Axient y soporte de liquidación inmediata.",
    keyAction: "Consultar Condiciones Roster",
    actionHref: "/artistas"
  },
  PROVIDER: {
    title: "Fincas & Proveedores de Red",
    badge: "Red Territorial Homologada",
    badgeColor: "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30",
    ticket: "10% Comisión Transparente",
    split: "Póliza RC 1.000.000 €",
    summary: "Sincronización técnica directa con bodas y eventos. Radar en vivo de horas muertas para alianzas B2B.",
    keyAction: "Área de Proveedor",
    actionHref: "/bodas/proveedor"
  }
};

export const SovereignMobileHUD: React.FC = React.memo(function SovereignMobileHUD() {
  const [isCockpitOpen, setIsCockpitOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Si estamos en /admin, el HUD público no interfiere
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/panel')) {
    return null;
  }

  // 🧭 DETECCIÓN CONTEXTUAL ESTRICTA DE LA VERTICAL (CERO CONTAMINACIÓN CRUZADA)
  const isNovios = Boolean(
    pathname?.startsWith('/bodas') ||
    pathname?.startsWith('/reservar') ||
    pathname?.startsWith('/mobile-fusion') ||
    pathname?.startsWith('/checkout')
  );
  const isArtistas = Boolean(pathname?.startsWith('/artistas'));
  const isFincas = Boolean(pathname?.startsWith('/fincas') || pathname?.startsWith('/fincasparaboda'));
  const isProveedor = Boolean(
    pathname?.startsWith('/bodas/proveedor') ||
    pathname?.startsWith('/proveedores') ||
    pathname?.startsWith('/arsenal')
  );
  const isB2G = Boolean(
    pathname?.startsWith('/b2g') ||
    pathname?.startsWith('/instituciones') ||
    pathname?.startsWith('/ocasiones')
  );

  // Paleta de acento según la vertical activa
  const accentColor = useMemo(() => {
    if (isArtistas) return '#FF2B44'; // Rubí S-Class
    if (isProveedor || isB2G) return '#00E5FF'; // Cyan Cuántico
    return '#ecb613'; // Oro Imperial para Bodas, Fincas y Home
  }, [isArtistas, isProveedor, isB2G]);

  // Selección de rol por defecto según la URL activa
  const defaultRole: MobileRole = useMemo(() => {
    if (isArtistas) return 'ARTISTA';
    if (isProveedor) return 'PROVIDER';
    if (isB2G) return 'B2G';
    return 'B2C';
  }, [isArtistas, isProveedor, isB2G]);

  const [selectedRole, setSelectedRole] = useState<MobileRole>(defaultRole);

  // Filtrado hermético de roles visibles en el Cockpit (eliminación de ruido)
  const allowedRoles: MobileRole[] = useMemo(() => {
    if (isNovios || isFincas) return ['B2C', 'PROVIDER']; // CERO B2G a novios o fincas
    if (isArtistas) return ['ARTISTA', 'B2C'];
    if (isProveedor) return ['PROVIDER', 'ARTISTA'];
    if (isB2G) return ['B2G'];
    return ['B2C', 'PROVIDER', 'ARTISTA', 'B2G']; // Home muestra los 4
  }, [isNovios, isFincas, isArtistas, isProveedor, isB2G]);

  const activeInsight = ROLE_INSIGHTS[selectedRole];

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
    playHapticClick(800, 0.02);
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
            onClick={() => {
              playHapticClick(600, 0.02);
              setIsCockpitOpen(false);
            }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[990] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* CONTENEDOR FLOTANTE MÓVIL (ANCLADO AL BOTTOM CON SAFE-AREA) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-lg z-[995] flex flex-col justify-end pointer-events-none md:hidden">

        {/* DRAWER / COCKPIT ACOMPAÑANTE ASTRA */}
        <AnimatePresence>
          {isCockpitOpen && (
            <motion.div
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full bg-[#07070b]/98 border rounded-3xl p-5 mb-3 shadow-[0_0_50px_rgba(0,0,0,0.9)] pointer-events-auto flex flex-col gap-4 max-h-[82vh] overflow-y-auto no-scrollbar"
              style={{ borderColor: `${accentColor}40` }}
            >
              {/* HEADER DEL COCKPIT */}
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                      ASTRA NEURAL COPILOT · V4.2
                    </span>
                  </div>
                  <h2 className="text-lg font-syne font-black text-white uppercase tracking-tight">
                    Experiencia <span style={{ color: accentColor }}>S-Class</span>
                  </h2>
                </div>
                <button
                  onClick={() => {
                    playHapticClick(600, 0.02);
                    setIsCockpitOpen(false);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
                  aria-label="Cerrar Cockpit"
                >
                  <X size={18} />
                </button>
              </div>

              {/* SELECTOR DE PERFIL AISLADO HERMÉTICAMENTE */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                  Perfil Activo:
                </span>
                <div className={`grid gap-1.5 ${allowedRoles.length === 1 ? 'grid-cols-1' : allowedRoles.length === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
                  {allowedRoles.map((r) => {
                    const isSelected = selectedRole === r;
                    const labels: Record<MobileRole, { name: string; icon: React.ComponentType<{ size: number; className?: string }> }> = {
                      B2G: { name: 'FITUR B2G', icon: Building2 },
                      B2C: { name: 'Bodas', icon: Users },
                      ARTISTA: { name: 'Artistas', icon: Music },
                      PROVIDER: { name: 'Proveedores', icon: Compass }
                    };
                    const ItemIcon = labels[r].icon;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          playHapticClick(750, 0.02);
                          setSelectedRole(r);
                        }}
                        className={`p-2.5 rounded-xl flex items-center justify-center gap-2 border text-center transition-all ${
                          isSelected
                            ? 'bg-white/10 text-white font-bold shadow-md'
                            : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white'
                        }`}
                        style={{ borderColor: isSelected ? accentColor : undefined }}
                      >
                        <ItemIcon size={14} className={isSelected ? 'text-white' : 'text-zinc-400'} />
                        <span className="text-[11px] font-mono font-bold leading-tight">{labels[r].name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TARJETA DINÁMICA DEL MOMENTO */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e0e18] to-[#0a0a10] border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeInsight.badgeColor}`}>
                    {activeInsight.badge}
                  </span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: accentColor }}>
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

                <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-400 border-t border-white/5">
                  <span>Gobernanza:</span>
                  <span className="text-white font-bold">{activeInsight.split}</span>
                </div>
              </div>

              {/* ACCIONES DEL COCKPIT */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleOpenConciergeChat}
                  className="py-3 px-3 rounded-xl text-black font-black uppercase text-[11px] font-mono flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                  style={{ backgroundColor: accentColor }}
                >
                  <Sparkles size={14} />
                  <span>Hablar con IA</span>
                </button>

                <button
                  onClick={() => {
                    playHapticClick(800, 0.02);
                    setIsCockpitOpen(false);
                    router.push(activeInsight.actionHref);
                  }}
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[11px] font-mono border border-white/10 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>{activeInsight.keyAction.split(' ')[0]} {activeInsight.keyAction.split(' ')[1] || 'Directo'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* ATENCIÓN DIRECTA WHATSAPP */}
              <a
                href={officialWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playHapticClick(900, 0.02)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-[11px] font-mono font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone size={13} />
                <span>Atención Inmediata: +34 693 693 048</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🚀 BARRA DE NAVEGACIÓN INFERIOR MORPHING (MUTACIÓN DINÁMICA POR RUTA) */}
        <nav
          aria-label="Navegación Móvil Principal"
          className="w-full h-15 bg-[#06060a]/92 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center justify-between px-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] pointer-events-auto"
        >
          {/* BOTÓN 1: INICIO O CATÁLOGO VERTICAL */}
          <button
            onClick={() => {
              playHapticClick(700, 0.02);
              if (isNovios) router.push('/bodas');
              else if (isArtistas) router.push('/artistas');
              else if (isFincas) router.push('/fincasparaboda');
              else if (isProveedor) router.push('/bodas/proveedor');
              else if (isB2G) router.push('/b2g');
              else router.push('/');
            }}
            className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 text-zinc-400 hover:text-white transition-colors"
            aria-label="Navegar a Principal"
          >
            {isNovios ? <Flame size={17} style={{ color: pathname === '/bodas' ? accentColor : undefined }} /> :
             isArtistas ? <Music size={17} style={{ color: pathname === '/artistas' ? accentColor : undefined }} /> :
             isFincas ? <Compass size={17} style={{ color: pathname === '/fincasparaboda' ? accentColor : undefined }} /> :
             isProveedor ? <FileText size={17} style={{ color: pathname === '/bodas/proveedor' ? accentColor : undefined }} /> :
             <Home size={17} style={{ color: pathname === '/' ? accentColor : undefined }} />}
            <span className="text-[9px] font-mono font-medium">
              {isNovios ? 'Bodas' : isArtistas ? 'Artistas' : isFincas ? 'Fincas' : isProveedor ? 'Escaparate' : isB2G ? 'B2G' : 'Inicio'}
            </span>
          </button>

          {/* BOTÓN 2: EXPERIENCIA CLAVE SEGÚN ROL */}
          <button
            onClick={() => {
              playHapticClick(750, 0.02);
              if (isNovios) router.push('/bodas/parejas');
              else if (isArtistas) router.push('/artistas');
              else if (isFincas) router.push('/fincas');
              else if (isProveedor) router.push('/bodas/proveedor');
              else router.push('/checkout/presupuesto');
            }}
            className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 text-zinc-400 hover:text-white transition-colors"
            aria-label="Experiencia del Perfil"
          >
            {isNovios ? <Sparkles size={17} style={{ color: pathname === '/bodas/parejas' ? accentColor : undefined }} /> :
             isProveedor ? <Radio size={17} style={{ color: accentColor }} /> :
             <Calculator size={17} />}
            <span className="text-[9px] font-mono font-medium">
              {isNovios ? 'Matcher' : isArtistas ? 'Repertorio' : isFincas ? 'Espacios' : isProveedor ? 'Radar B2B' : 'Cotizar'}
            </span>
          </button>

          {/* BOTÓN 3 CENTRAL WOW: ORÁCULO ASTRA COPILOT */}
          <button
            onClick={() => {
              playHapticClick(850, 0.03);
              setIsCockpitOpen(!isCockpitOpen);
            }}
            className="relative -top-4 w-13 h-13 rounded-full flex items-center justify-center text-black border-4 border-[#06060a] shadow-[0_0_25px_rgba(236,182,19,0.5)] active:scale-90 transition-all group"
            style={{ backgroundColor: accentColor }}
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

          {/* BOTÓN 4: SELLO O RADAR DEL ROL */}
          <button
            onClick={() => {
              playHapticClick(750, 0.02);
              if (isNovios) router.push('/mobile-fusion');
              else if (isArtistas) router.push('/rider-tecnico');
              else if (isFincas) router.push('/soberania-tecnica');
              else if (isProveedor) router.push('/panel');
              else router.push('/soberania-tecnica');
            }}
            className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 text-zinc-400 hover:text-white transition-colors"
            aria-label="Sello o Radar"
          >
            {isNovios ? <Sliders size={17} style={{ color: pathname === '/mobile-fusion' ? accentColor : undefined }} /> :
             <ShieldCheck size={17} />}
            <span className="text-[9px] font-mono font-medium">
              {isNovios ? 'Embudo' : isArtistas ? 'Rider' : isFincas ? 'Acústica' : isProveedor ? 'Panel' : 'Garantía'}
            </span>
          </button>

          {/* BOTÓN 5: WHATSAPP DIRECTO */}
          <a
            href={officialWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playHapticClick(900, 0.03)}
            className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            aria-label="Contactar por WhatsApp Oficial"
          >
            <MessageCircle size={17} />
            <span className="text-[9px] font-mono font-medium">Directo</span>
          </a>
        </nav>
      </div>
    </>
  );
});

export default SovereignMobileHUD;
