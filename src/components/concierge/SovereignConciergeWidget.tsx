'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Sparkles,
  X,
  MessageSquare,
  Calendar,
  FileText,
  CheckCircle2,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
  Link2,
  Loader2,
  CalendarDays,
} from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

const CLEAN_PHONE: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

interface RouteContextConfig {
  title: string;
  badge: string;
  greeting: string;
  category: string;
  providerName: string;
  suggestedWa: string;
  showScraper?: boolean;
}

function getContextForRoute(pathname: string): RouteContextConfig {
  if (pathname.includes('/reservar/solista') || pathname.includes('/artistas/e78903') || pathname.includes('/edwin-agudelo')) {
    return {
      title: 'Edwin Agudelo · Solista Exclusivo',
      badge: 'Tarifa Canónica 350 €',
      greeting: 'Hola, soy el asistente de Edwin Agudelo. ¿Tienes ya fecha para tu evento? Consulta disponibilidad o reserva con precio congelado.',
      category: 'Solista',
      providerName: 'Edwin Agudelo',
      suggestedWa: 'Hola Edwin, estoy en tu ficha de solista y deseo consultar disponibilidad y precio para mi fecha.',
    };
  }
  if (pathname.includes('/ayuntamientos') || pathname.includes('/vimume/b2g') || pathname.includes('/b2g')) {
    return {
      title: 'Gabinete B2G Institucional',
      badge: 'Art. 118 LCSP',
      greeting: 'Gabinete B2G activo. ¿Deseas tramitar la memoria técnica, pliego o contrato menor Art. 118 LCSP para tu ayuntamiento?',
      category: 'B2G',
      providerName: 'Gabinete B2G EAR OS',
      suggestedWa: 'Hola Edwin, represento a un ayuntamiento/entidad pública y deseo tramitar expediente B2G bajo Art. 118 LCSP.',
    };
  }
  if (pathname.includes('/portal/proveedor') || pathname.includes('/fichas') || pathname.includes('/proveedores')) {
    return {
      title: 'Homologación de Proveedores',
      badge: 'Traslado Soberano · S-Class',
      greeting: '¿Vienes de Bodas.net? Pega tu enlace aquí abajo o habla con la Centralita para homologar tu ficha en EAR OS gratis.',
      category: 'Proveedor',
      providerName: 'Portal Proveedores EAR OS',
      suggestedWa: 'Hola, soy proveedor de eventos y deseo solicitar la homologación de mi ficha en EAR OS.',
      showScraper: true,
    };
  }
  if (pathname.includes('/otzarreta') || pathname.includes('/fincas')) {
    return {
      title: 'Fincas & Espacios Homologados',
      badge: 'Garantía Acústica S-Class',
      greeting: 'Bienvenido al catálogo de Fincas Homologadas. ¿Buscas aforo, limitador acústico o menús de temporada 2026?',
      category: 'Fincas',
      providerName: 'Fincas Homologadas',
      suggestedWa: 'Hola Edwin, estoy valorando fincas en EAR OS y deseo consultar aforo y condiciones técnicas.',
    };
  }
  if (pathname.includes('/seating-planner')) {
    return {
      title: 'Pulpetti Seating Planner SOTA',
      badge: 'Layout 3D / SVG',
      greeting: 'Organizador interactivo de mesas y aforos. ¿Necesitas exportar tu plano de mesas o sincronizar invitados?',
      category: 'Herramientas',
      providerName: 'Pulpetti Seating Planner',
      suggestedWa: 'Hola, estoy configurando mi plano de mesas en el Seating Planner y requiero asistencia técnica.',
    };
  }
  if (pathname.includes('/presupuesto') || pathname.includes('/calculadora')) {
    return {
      title: 'Planificador Presupuestario',
      badge: 'Split 80/10/10',
      greeting: 'Calculadora de presupuesto en céntimos exactos. ¿Deseas fijar fecha con depósito Stripe Price-Lock?',
      category: 'Presupuesto',
      providerName: 'Calculadora EAR OS',
      suggestedWa: 'Hola Edwin, he calculado un presupuesto en la web y deseo formalizar reserva garantizada.',
    };
  }

  return {
    title: 'Conserjería IA · Centralita EAR OS',
    badge: 'En línea · < 1 min',
    greeting: 'Bienvenido a Productora EAR. Estoy coordinando la centralita en tiempo real. ¿En qué podemos ayudarte hoy?',
    category: 'General',
    providerName: 'Centralita EAR OS',
    suggestedWa: 'Hola Productora EAR, estoy navegando por productoraear.com y deseo consultar disponibilidad e información.',
  };
}

export function SovereignConciergeWidget() {
  const pathname = usePathname() ?? '/';
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<'mediodia' | 'tarde' | 'noche'>('tarde');

  // Scraper simulator state
  const [scraperUrl, setScraperUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<{
    photos: number;
    menuPrice: number;
    capacity: number;
    name: string;
  } | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const routeContext = useMemo(() => getContextForRoute(pathname), [pathname]);

  const notifyWebhook = useCallback((action: string, extraData?: Record<string, unknown>) => {
    try {
      const payload = JSON.stringify({
        pathname,
        providerName: routeContext.providerName,
        category: routeContext.category,
        action,
        selectedDate: selectedDate || null,
        selectedSlot: selectedDate ? selectedSlot : null,
        timestamp: new Date().toISOString(),
        ...extraData,
      });

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/concierge/webhook', new Blob([payload], { type: 'application/json' }));
        return;
      }

      void fetch('/api/concierge/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
        credentials: 'omit',
      }).catch(() => {
        // Fallback silencioso sin bloquear al usuario
      });
    } catch {
      // Silencio deliberado
    }
  }, [pathname, routeContext, selectedDate, selectedSlot]);

  // Construct WhatsApp destination URL
  const waUrl = useMemo(() => {
    let msg = routeContext.suggestedWa;
    if (selectedDate) {
      msg += ` He preseleccionado la fecha ${selectedDate} en turno ${selectedSlot.toUpperCase()}.`;
    }
    if (scrapeResult) {
      msg += ` [Enlace analizado: ${scraperUrl} | Aforo: ${scrapeResult.capacity} pax | Menú: ${scrapeResult.menuPrice} €]`;
    }
    return `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(msg)}`;
  }, [routeContext.suggestedWa, selectedDate, selectedSlot, scrapeResult, scraperUrl]);

  const handleWhatsAppClick = useCallback(() => {
    notifyWebhook('whatsapp_click');
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }, [notifyWebhook, waUrl]);

  const handleDossierClick = useCallback(() => {
    notifyWebhook('dossier_print_click');
    if (pathname.includes('/portal/proveedor') || pathname.includes('/otzarreta')) {
      window.print();
    } else {
      // Abre el portal de proveedor o el modal de dossier
      window.open('/portal/proveedor', '_blank');
    }
  }, [notifyWebhook, pathname]);

  const handleScrapeSimulate = useCallback(() => {
    if (!scraperUrl.trim()) return;
    setIsScraping(true);
    setScrapeResult(null);

    setTimeout(() => {
      setIsScraping(false);
      const isE78903 = scraperUrl.includes('e78903') || scraperUrl.toLowerCase().includes('productora-ear');
      if (isE78903) {
        setScrapeResult({
          name: 'Productora EAR / Edwin Agudelo (Solista e78903)',
          photos: 24,
          menuPrice: 550,
          capacity: 250,
        });
        notifyWebhook('sovereign_showcase_migration', {
          showcaseUrl: scraperUrl,
          providerId: 'e78903',
          providerName: 'Productora EAR / Edwin Agudelo',
          category: 'MUSICA_DIRECTO',
        });
      } else {
        setScrapeResult({
          name: scraperUrl.replace(/^https?:\/\//i, '').split('/')[0] || 'Escaparate Detectado',
          photos: 14,
          menuPrice: 145,
          capacity: 350,
        });
        notifyWebhook('scraper_link_analyzed', { link: scraperUrl });
      }
    }, 600);
  }, [scraperUrl, notifyWebhook]);

  const handlePatientZeroPreset = useCallback((preset: 'edwin' | 'otzarreta') => {
    setIsScraping(false);
    if (preset === 'edwin') {
      const canonicalUrl = 'https://www.bodas.net/musica/productora-ear--e78903';
      setScraperUrl(canonicalUrl);
      setScrapeResult({
        name: 'Productora EAR / Edwin Agudelo (Solista e78903)',
        photos: 24,
        menuPrice: 550,
        capacity: 250,
      });
      notifyWebhook('sovereign_showcase_migration', {
        showcaseUrl: canonicalUrl,
        providerId: 'e78903',
        providerName: 'Productora EAR / Edwin Agudelo',
        category: 'MUSICA_DIRECTO',
      });
    } else {
      setScraperUrl('https://productoraear.com/otzarreta');
      setScrapeResult({
        name: 'Eduardo Martínez (Otzarreta / Ezkertza Berria · Derio)',
        photos: 32,
        menuPrice: 145,
        capacity: 350,
      });
      notifyWebhook('patient_zero_preset', { preset: 'otzarreta_derio' });
    }
  }, [notifyWebhook]);

  // Exclude from admin back-office routes
  if (!mounted || pathname.startsWith('/admin') || pathname.startsWith('/panel')) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(var(--ear-dock-h,5rem)+0.75rem)] lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end select-none">
      {/* ─── CHAT POPOVER S-CLASS ─── */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label="Conserjería IA Productora EAR"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] max-h-[85vh] overflow-y-auto bg-[#09090d]/98 backdrop-blur-2xl border border-[#ecb613]/40 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] text-white flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/80 bg-gradient-to-r from-[#0d0d14] via-[#09090d] to-[#121008] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ecb613]/20 to-amber-900/30 border border-[#ecb613]/50 flex items-center justify-center text-[#ecb613] shadow-[0_0_15px_rgba(236,182,19,0.2)]">
                  <Bot size={22} className="animate-pulse" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-black"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-wide font-montserrat">
                    {routeContext.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                  <span className="text-[#ecb613] font-semibold">{routeContext.badge}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-emerald-400">
                    <Clock size={11} /> &lt; 1 min
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
              aria-label="Cerrar Conserjería"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-4 text-xs font-montserrat">
            {/* Contextual Greeting Bubble */}
            <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl rounded-tl-sm text-zinc-200 leading-relaxed shadow-inner">
              <div className="flex items-center gap-1.5 text-[#ecb613] font-mono text-[10px] uppercase font-bold mb-1.5">
                <Sparkles size={12} />
                <span>Asistente Activo</span>
              </div>
              <p>{routeContext.greeting}</p>
            </div>

            {/* Trojan Scraper Input (Si aplica o en ficha de proveedores) */}
            {routeContext.showScraper && (
              <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px]">
                    <Link2 size={13} className="text-[#ecb613]" />
                    <span>Pega tu escaparate (Bodas.net o web):</span>
                  </div>
                </div>

                {/* Quick Presets Pacientes Cero */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePatientZeroPreset('edwin')}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[#ecb613] font-mono text-[9px] border border-amber-500/20 transition-colors"
                  >
                    🎵 Edwin Agudelo
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePatientZeroPreset('otzarreta')}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[#ecb613] font-mono text-[9px] border border-amber-500/20 transition-colors"
                  >
                    🏰 Eduardo Martínez
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://www.bodas.net/fincas/..."
                    value={scraperUrl}
                    onChange={(e) => setScraperUrl(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
                  />
                  <button
                    type="button"
                    onClick={handleScrapeSimulate}
                    disabled={isScraping || !scraperUrl.trim()}
                    className="px-3 py-1.5 bg-[#ecb613] hover:bg-amber-400 text-black font-bold rounded-lg transition-colors disabled:opacity-50 text-[11px] flex items-center gap-1"
                  >
                    {isScraping ? <Loader2 size={12} className="animate-spin" /> : 'Analizar'}
                  </button>
                </div>

                {scrapeResult && (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 space-y-1 text-[11px] animate-in fade-in">
                    <div className="font-bold flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 size={13} />
                      <span>{scrapeResult.name}</span>
                    </div>
                    <p className="text-zinc-300">
                      {scrapeResult.name.includes('Edwin')
                        ? 'Hub Méntrida · Tarifa estándar 550 € con 100 km incluidos (Suelo 350 €). Km extra a 0,50 € y hotel a 80 €.'
                        : scrapeResult.name.includes('Eduardo')
                        ? 'Finca Singular Derio · Menús de temporada 2026 desde 145 €, aforo 50-350 pax, acústica ≤ 75 dB SPL.'
                        : `Detectadas ${scrapeResult.photos} fotos, menú desde ${scrapeResult.menuPrice} € y aforo para ${scrapeResult.capacity} invitados.`}
                    </p>
                    <p className="text-[#ecb613] font-mono font-bold">
                      Ficha preliminar lista para homologación oficial gratuita.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Date Picker Toggle Section */}
            {showDatePicker && (
              <div className="p-3 bg-zinc-900/90 border border-amber-500/30 rounded-xl space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-zinc-200 font-bold text-[11px]">
                  <span className="flex items-center gap-1 text-[#ecb613]">
                    <CalendarDays size={13} /> Seleccionar Fecha del Evento
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="text-zinc-400 hover:text-white text-[10px]"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 block">Fecha aproximada o confirmada:</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black/80 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#ecb613] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block">Franja horaria preferente:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['mediodia', 'tarde', 'noche'] as const).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-1 text-[10px] font-mono uppercase font-bold rounded-md border transition-all ${
                          selectedSlot === slot
                            ? 'bg-[#ecb613] text-black border-[#ecb613]'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedDate && (
                  <p className="text-[10px] text-emerald-400 font-mono">
                    ✓ Fecha {selectedDate} guardada en el contexto de consulta.
                  </p>
                )}
              </div>
            )}

            {/* ─── 3 ACCIONES DE 1 CLIC ─── */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider block">
                Acciones Inmediatas (1 Clic):
              </span>

              {/* Botón A: WhatsApp Directo */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full p-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl flex items-center justify-between shadow-lg shadow-emerald-950/40 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-black/20 text-white">
                    <MessageSquare size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">Hablar directo con Edwin</div>
                    <div className="text-[10px] text-emerald-200 font-normal">WhatsApp Oficial · +34 693 693 048</div>
                  </div>
                </div>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Botón B: Dossier Oficial A4 */}
              <button
                type="button"
                onClick={handleDossierClick}
                className="w-full p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-100 font-semibold rounded-xl flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#ecb613]/10 text-[#ecb613]">
                    <FileText size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">Dossier / Memoria Oficial A4</div>
                    <div className="text-[10px] text-zinc-400 font-normal">Memoria técnica & tarifario homologado</div>
                  </div>
                </div>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-zinc-400" />
              </button>

              {/* Botón C: Consultar Disponibilidad de Fecha */}
              <button
                type="button"
                onClick={() => setShowDatePicker((prev) => !prev)}
                className="w-full p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-100 font-semibold rounded-xl flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Calendar size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">Consultar Disponibilidad de Fecha</div>
                    <div className="text-[10px] text-zinc-400 font-normal">
                      {selectedDate ? `Seleccionada: ${selectedDate}` : 'Ver calendario y franjas horarias'}
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-zinc-800/80 bg-black/40 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#ecb613]" />
              <span>Garantía S-Class EAR OS</span>
            </div>
            <a
              href={`tel:${CLEAN_PHONE}`}
              className="hover:text-[#ecb613] transition-colors flex items-center gap-1"
            >
              <Phone size={10} />
              <span>{CENTRALITA_EAR_OS}</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── BURBUJA FLOTANTE PRINCIPAL (OLED S-CLASS) ─── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir Conserjería IA Productora EAR"
        className="group relative flex items-center gap-3 bg-[#09090d]/95 hover:bg-[#12121a] border border-[#ecb613]/50 hover:border-[#ecb613] p-2.5 sm:p-3 rounded-full shadow-[0_8px_32px_rgba(236,182,19,0.25)] hover:shadow-[0_8px_36px_rgba(236,182,19,0.45)] transition-all duration-300 hover:scale-105"
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ecb613] via-amber-400 to-amber-200 text-black flex items-center justify-center shadow-md">
            {isOpen ? <X size={20} className="font-bold" /> : <Bot size={22} />}
          </div>
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#09090d]"></span>
            </span>
          )}
        </div>

        {/* Text pill for desktop & hover */}
        <div className="hidden sm:flex flex-col text-left pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide font-montserrat">
              Agente EAR OS
            </span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              En línea
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Respuesta en &lt; 1 min
          </span>
        </div>
      </button>
    </div>
  );
}
