'use client';

/**
 * 👑 EAR OS V2 — VISTA PÚBLICA INTERACTIVA DE PROPUESTA S-CLASS (OMEGA VANGUARDIA)
 * ------------------------------------------------------------------
 * Interfaz interactiva de alta fidelidad para el cliente (novios / organizadores).
 * Características:
 *  - Acordeón Vanguardista de 7 Fases del Evento con buscador en vivo y filtros.
 *  - Detección estricta de homologación: cero precios alucinados de terceros.
 *  - Selector dinámico de opcionales con recálculo determinista en céntimos enteros.
 *  - Modal "¿Tienes Dudas?" con alerta en tiempo real a Telegram de Edwin.
 *  - Galería de notas de campo y fotografías adjuntas del espacio.
 *  - Desglose financiero con Split Soberano 80/10/10 y Retorno Social VIMUME.
 *  - Lienzo de firma digital manuscrita y pasarela de depósito Stripe 100 €.
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Sparkles,
  CreditCard,
  FileCheck2,
  HeartHandshake,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  ImageIcon,
  Send,
  X,
  Filter,
  Info,
  Check,
  Utensils,
  Building2,
  Camera,
  Flower2,
  Bus,
  Star,
  Phone,
} from 'lucide-react';
import type { SovereignProposal, ProposalLineItem, EventPhase } from '@/lib/proposals/proposal-types';
import { calcularTotalesPropuesta, formatoEuros } from '@/lib/proposals/proposal-calculator';
import { ProposalSignatureCanvas } from './ProposalSignatureCanvas';

interface ProposalInteractiveClientProps {
  propuestaInicial: SovereignProposal;
}

// Configuración de las 7 Fases Canónicas del Evento
const FASES_CONFIG: Record<EventPhase, { nombre: string; icono: string; desc: string }> = {
  ceremonia: {
    nombre: '1. Ceremonia (Civil o Religiosa)',
    icono: '⛪',
    desc: 'Microfonía inalámbrica, oficiante, atril, lecturas y acompañamiento musical en directo.',
  },
  coctel: {
    nombre: '2. Cóctel & Aperitivos',
    icono: '🍸',
    desc: 'Ambientación sonora 360°, música en vivo y bienvenida a invitados.',
  },
  banquete: {
    nombre: '3. Banquete / Cena',
    icono: '🍽️',
    desc: 'Megafonía para discursos, hilo musical y momentos clave de entrada y tarta.',
  },
  baile: {
    nombre: '4. Baile Nupcial & Efectos',
    icono: '💫',
    desc: 'Vals de novios, chispas frías no pirotécnicas y humo bajo rasante criogénico.',
  },
  fiesta: {
    nombre: '5. Barra Libre & Fiesta Disco',
    icono: '🎧',
    desc: 'Sistema de audio de alta presión Bose F1 (1.000W), cabina DJ, iluminación y horas extras.',
  },
  iluminacion: {
    nombre: '6. Iluminación Arquitectónica',
    icono: '💡',
    desc: 'Bañadores perimetrales wireless a batería y cabezas móviles programadas.',
  },
  logistica: {
    nombre: '7. Logística & Montaje S-Class',
    icono: '🚐',
    desc: 'Transporte desde Méntrida, montaje previo garantizado y alojamiento técnico.',
  },
};

export function ProposalInteractiveClient({ propuestaInicial }: ProposalInteractiveClientProps) {
  const [propuesta, setPropuesta] = useState<SovereignProposal>(propuestaInicial);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [sendingQuestion, setSendingQuestion] = useState(false);
  const [questionSentSuccess, setQuestionSentSuccess] = useState(false);
  const [updatingOptionId, setUpdatingOptionId] = useState<string | null>(null);

  // Estados de filtrado y navegación de acordeones
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCapituloFilter, setSelectedCapituloFilter] = useState<string>('TODOS');
  const [openPhases, setOpenPhases] = useState<Record<EventPhase, boolean>>({
    ceremonia: true,
    coctel: true,
    banquete: true,
    baile: true,
    fiesta: true,
    iluminacion: true,
    logistica: true,
  });

  // Recálculo determinista de totales
  const totales = useMemo(() => {
    return calcularTotalesPropuesta(propuesta.lineas, propuesta.ivaPct, propuesta.descuentoPct);
  }, [propuesta.lineas, propuesta.ivaPct, propuesta.descuentoPct]);

  // Alternar apertura de acordeón
  const togglePhaseAccordion = (fase: EventPhase) => {
    setOpenPhases(prev => ({ ...prev, [fase]: !prev[fase] }));
  };

  // Filtrado reactivo de partidas
  const filteredLineas = useMemo(() => {
    return propuesta.lineas.filter(l => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || l.descripcion.toLowerCase().includes(q) || l.capitulo.toLowerCase().includes(q);
      const matchesCapitulo = selectedCapituloFilter === 'TODOS' || l.capitulo === selectedCapituloFilter;
      return matchesSearch && matchesCapitulo;
    });
  }, [propuesta.lineas, searchQuery, selectedCapituloFilter]);

  // Función de deducción estricta para garantizar que cada partida vaya a su fase correspondiente
  const deducirFaseFallback = (l: ProposalLineItem): EventPhase => {
    if (l.fase && ['ceremonia', 'coctel', 'banquete', 'baile', 'fiesta', 'iluminacion', 'logistica'].includes(l.fase)) {
      return l.fase;
    }
    const txt = `${l.descripcion} ${l.codigo || ''} ${l.capitulo}`.toLowerCase();
    if (txt.includes('ceremonia') || txt.includes('oficiante') || txt.includes('snd-cer') || txt.includes('art-duo') || txt.includes('art-tri') || txt.includes('art-cua')) return 'ceremonia';
    if (txt.includes('coctel') || txt.includes('cóctel') || txt.includes('aperitivo') || txt.includes('art-sol') || txt.includes('snd-coc')) return 'coctel';
    if (txt.includes('banquete') || txt.includes('cena') || txt.includes('comida') || txt.includes('snd-ban')) return 'banquete';
    if (txt.includes('baile') || txt.includes('chispas') || txt.includes('humo') || txt.includes('efe-chi') || txt.includes('efe-hum')) return 'baile';
    if (txt.includes('ilumina') || txt.includes('perimetral') || txt.includes('focos') || txt.includes('ilu-per') || txt.includes('ilu-gir')) return 'iluminacion';
    if (txt.includes('logistica') || txt.includes('logística') || txt.includes('km') || txt.includes('hotel') || txt.includes('desplazamiento') || txt.includes('log-km')) return 'logistica';
    return 'fiesta';
  };

  // Agrupación por fases del evento con asignación garantizada
  const lineasPorFase = useMemo(() => {
    const map: Record<EventPhase, ProposalLineItem[]> = {
      ceremonia: [],
      coctel: [],
      banquete: [],
      baile: [],
      fiesta: [],
      iluminacion: [],
      logistica: [],
    };
    for (const l of filteredLineas) {
      const faseReal = deducirFaseFallback(l);
      map[faseReal].push({ ...l, fase: faseReal });
    }
    return map;
  }, [filteredLineas]);

  // Alternar selección de opcionales
  const handleToggleOption = async (lineaId: string, actual: boolean) => {
    setUpdatingOptionId(lineaId);
    const nuevoEstado = !actual;

    setPropuesta(prev => ({
      ...prev,
      lineas: prev.lineas.map(l =>
        l.id === lineaId ? { ...l, seleccionada: nuevoEstado } : l
      ),
    }));

    try {
      await fetch('/api/proposals/option-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: propuesta.token,
          lineaId,
          seleccionada: nuevoEstado,
        }),
      });
    } catch {
      setPropuesta(prev => ({
        ...prev,
        lineas: prev.lineas.map(l =>
          l.id === lineaId ? { ...l, seleccionada: actual } : l
        ),
      }));
    } finally {
      setUpdatingOptionId(null);
    }
  };

  // Enviar duda o pregunta
  const handleSendQuestion = async () => {
    if (!questionText.trim() || sendingQuestion) return;
    setSendingQuestion(true);

    try {
      const res = await fetch('/api/proposals/dudas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: propuesta.token,
          texto: questionText.trim(),
        }),
      });

      if (!res.ok) throw new Error('Error al enviar duda');

      setQuestionSentSuccess(true);
      setTimeout(() => {
        setIsQuestionModalOpen(false);
        setQuestionSentSuccess(false);
        setQuestionText('');
      }, 2000);
    } catch (err) {
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setSendingQuestion(false);
    }
  };

  const handleSignatureSuccess = () => {
    setIsSigningOpen(false);
    const now = new Date();
    setPropuesta(prev => ({
      ...prev,
      estado: 'ganado',
      firma: {
        fecha: now.toLocaleDateString('es-ES'),
        hora: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        ip: 'Firmado Digitalmente',
        dispositivo: 'Navegador Web S-Class',
        pngBase64: '',
      },
    }));
  };

  const handleStripeCheckout = () => {
    window.location.href = `/api/stripe/checkout?token=${propuesta.token}&type=proposal_deposit`;
  };

  const capitulosDisponibles = [
    'TODOS',
    'Fincas',
    'Catering',
    'Artistas',
    'Sonorización',
    'Fotografía',
    'Decoración',
    'Iluminación',
    'Efectos',
    'Transporte',
    'Logística',
    'Servicios',
  ];

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
      {/* Barra superior de navegación y acciones rápidas */}
      <nav className="no-imprimir sticky top-0 z-40 border-b border-[#ecb613]/20 bg-[#050507]/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-300 truncate">
              Propuesta Oficial #{propuesta.numero}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuestionModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#ecb613]/50 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#ecb613]" />
              <span className="hidden sm:inline">¿Dudas?</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg border border-white/10 hover:border-[#ecb613]/50 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Descargar o Imprimir PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {propuesta.estado !== 'ganado' ? (
              <button
                onClick={() => setIsSigningOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-[#ecb613] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#d8a40f] transition-all shadow-md shadow-[#ecb613]/20 cursor-pointer"
              >
                Firmar Propuesta
              </button>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Firmada
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Contenedor Principal del Dossier */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Cabecera de la propuesta */}
        <header data-seccion="cabecera" className="border-b border-white/10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-semibold tracking-widest text-[#ecb613] uppercase">
                Productora EAR · Infraestructura Audiovisual S-Class
              </span>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white font-syne tracking-tight">
                {propuesta.titulo}
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Propuesta técnica y rider exclusivo para <strong>{propuesta.cliente.nombre}</strong>.
              </p>
            </div>

            <div className="bg-[#08080c] border border-white/10 rounded-xl p-4 text-xs space-y-1.5 flex-shrink-0">
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar className="w-4 h-4 text-[#ecb613]" />
                <span>Fecha evento: <strong className="text-white">{propuesta.cliente.fechaEvento}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#ecb613]" />
                <span>Espacio: <strong className="text-white">{propuesta.cliente.fincaOEspacio}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Users className="w-4 h-4 text-[#ecb613]" />
                <span>Aforo estimado: <strong className="text-white">{propuesta.cliente.paxEstimado} pax</strong></span>
              </div>
              {propuesta.cliente.cateringNombre && (
                <div className="flex items-center gap-2 text-neutral-300">
                  <Utensils className="w-4 h-4 text-[#ecb613]" />
                  <span>Catering: <strong className="text-white">{propuesta.cliente.cateringNombre}</strong></span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Resumen de Calidad & Rider Acústico Bose F1 */}
        <section data-seccion="resumen" className="mt-8 rounded-2xl border border-[#ecb613]/20 bg-[#060609] p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-[#ecb613] uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4" />
            Garantía Acústica S-Class & Operador Técnico Certificado
          </div>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Equipamiento acústico homologado: microfonía inalámbrica blindada Shure Beta 87A para oficiante y novios, columnas de alta fidelidad Bose F1 Model 812 ajustadas a 12 W/pax y técnico residente durante toda la celebración.
          </p>
        </section>

        {/* Notas y Bocetos de Montaje Adjuntos si existen */}
        {propuesta.imagenesAdjuntas && propuesta.imagenesAdjuntas.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-[#07070a] p-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ecb613] font-bold">
              <ImageIcon className="w-4 h-4" />
              Documentación Gráfica & Notas de Campo Adjuntas
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {propuesta.imagenesAdjuntas.map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-black">
                  <img src={img} alt={`Documento de campo ${idx + 1}`} className="w-full h-auto object-contain max-h-64" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Barra de Filtros Inteligentes y Buscador en Vivo */}
        <div className="no-imprimir mt-10 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar servicio (ej. violín, bose, chispas, perimetral, hora extra, mariachi...)"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-[#07070b] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
              {capitulosDisponibles.map((cap) => (
                <button
                  key={cap}
                  onClick={() => setSelectedCapituloFilter(cap)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    selectedCapituloFilter === cap
                      ? 'bg-[#ecb613] text-black font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACORDEÓN VANGUARDISTA DE 7 FASES */}
        <div className="mt-8 space-y-4">
          {(Object.keys(FASES_CONFIG) as EventPhase[]).map((faseKey) => {
            const config = FASES_CONFIG[faseKey];
            const lineasFase = lineasPorFase[faseKey] || [];
            const isOpen = openPhases[faseKey];

            if (lineasFase.length === 0 && searchQuery) return null;

            return (
              <div
                key={faseKey}
                data-seccion="capitulos"
                className="rounded-2xl border border-white/10 bg-[#07070b] overflow-hidden transition-all shadow-md"
              >
                {/* Cabecera del Acordeón */}
                <div
                  onClick={() => togglePhaseAccordion(faseKey)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{config.icono}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white font-syne truncate">
                          {config.nombre}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                          {lineasFase.length} {lineasFase.length === 1 ? 'servicio' : 'servicios'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {config.desc}
                      </p>
                    </div>
                  </div>

                  <button className="text-neutral-400 hover:text-white p-1">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#ecb613]" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Contenido desplegable del Acordeón */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-3">
                    {lineasFase.length === 0 ? (
                      <p className="text-xs text-neutral-500 py-3 italic">
                        No hay servicios configurados en esta fase para esta propuesta.
                      </p>
                    ) : (
                      lineasFase.map((linea) => {
                        const isOpcional = linea.esOpcional;
                        const isSelected = linea.seleccionada;
                        const isUpdating = updatingOptionId === linea.id;

                        return (
                          <div
                            key={linea.id}
                            onClick={() => isOpcional && handleToggleOption(linea.id, isSelected)}
                            className={`p-4 rounded-xl border transition-all ${
                              isOpcional
                                ? isSelected
                                  ? 'border-[#ecb613] bg-[#ecb613]/5 cursor-pointer shadow-md shadow-[#ecb613]/5'
                                  : 'border-white/10 bg-[#09090d]/60 hover:border-white/25 opacity-75 cursor-pointer'
                                : 'border-white/10 bg-[#09090d]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                {isOpcional ? (
                                  <div
                                    className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                                      isSelected
                                        ? 'bg-[#ecb613] border-[#ecb613] text-black'
                                        : 'border-neutral-500 bg-transparent'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                ) : (
                                  <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400 flex-shrink-0" />
                                )}

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#ecb613] border border-white/10">
                                      {linea.capitulo}
                                    </span>
                                    {isOpcional && (
                                      <span className="text-[10px] font-mono uppercase text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded">
                                        OPCIONAL CONFIGURABLE
                                      </span>
                                    )}
                                    {linea.proveedorVerificado ? (
                                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Homologado EAR OS
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        Tarifa en validación técnica
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="mt-1.5 text-sm sm:text-base font-semibold text-white">
                                    {linea.descripcion}
                                  </h4>

                                  {/* Ficha enriquecida del Proveedor Vinculado de la Mega Base de Datos */}
                                  {linea.proveedorNombre && (
                                    <div className="mt-2 flex flex-wrap items-center gap-2 p-2 rounded-lg bg-black/60 border border-white/10">
                                      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
                                        <span className="text-[#ecb613]">✦</span>
                                        <span>{linea.proveedorNombre}</span>
                                      </div>
                                      {linea.proveedorRating && (
                                        <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-amber-400/20">
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                          {linea.proveedorRating}
                                          {linea.proveedorReviews && <span className="text-neutral-400">({linea.proveedorReviews})</span>}
                                        </span>
                                      )}
                                      {linea.proveedorGremio && (
                                        <span className="text-[10px] font-mono uppercase text-neutral-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                                          {linea.proveedorGremio}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Especificaciones Técnicas y Operativas de la BBDD */}
                                  {linea.detallesTecnicos && Object.keys(linea.detallesTecnicos).length > 0 && (
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-neutral-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                                      {Object.entries(linea.detallesTecnicos).map(([key, val]) => (
                                        <div key={key} className="flex items-center gap-1.5 min-w-0">
                                          <span className="text-[#ecb613]/70 font-semibold">•</span>
                                          <span className="capitalize text-neutral-300 truncate">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                          <span className="text-neutral-400 truncate">{String(val)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {linea.motivoIa && (
                                    <p className="mt-1 text-xs text-amber-400/90 font-mono">
                                      {linea.motivoIa}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0">
                                {linea.esAmarilla ? (
                                  <div>
                                    <span className="text-xs font-mono font-bold text-amber-400 block">
                                      A CONFIRMAR
                                    </span>
                                    <span className="text-[10px] text-neutral-500 block">
                                      Pendiente de ficha
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span
                                      className={`text-sm sm:text-base font-bold font-mono block ${
                                        isOpcional && !isSelected ? 'text-neutral-400' : 'text-[#ecb613]'
                                      }`}
                                    >
                                      {isOpcional ? `+${formatoEuros(linea.totalCéntimos)}` : formatoEuros(linea.totalCéntimos)}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 block">
                                      {isUpdating
                                        ? 'Guardando...'
                                        : isOpcional
                                        ? isSelected
                                          ? 'Añadido al total'
                                          : 'No incluido'
                                        : 'Base sin IVA'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desglose total y Split Soberano 80/10/10 */}
        <section data-seccion="total" className="mt-12 rounded-2xl border border-[#ecb613]/30 bg-[#08080d] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Split Soberano 80/10/10 Badge */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ecb613] font-bold">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                Split Soberano 80/10/10 & Retorno Social VIMUME
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                El <strong>80%</strong> de tu presupuesto retribuye directamente a los músicos y técnicos ejecutores en digna retribución sin comisiones abusivas. El <strong>10%</strong> financia sesiones de neuro-musicoterapia VIMUME (Ley 49/2002 con deducción de hasta el 80% y SROI 4.85x) y el <strong>10%</strong> cubre la pasarela técnica y soporte EAR OS.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                <span>Artista: <strong className="text-white">{formatoEuros(totales.split.artistaCéntimos)}</strong></span>
                <span>EAR OS: <strong className="text-white">{formatoEuros(totales.split.earOsCéntimos)}</strong></span>
                <span>VIMUME: <strong className="text-emerald-400">{formatoEuros(totales.split.vimumeCéntimos)}</strong></span>
              </div>
            </div>

            {/* Total final en céntimos */}
            <div className="bg-[#040406] border border-white/10 rounded-xl p-6 text-right space-y-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Base Imponible:</span>
                <span className="font-mono text-white">{formatoEuros(totales.baseCéntimos)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400">
                <span>IVA ({totales.ivaPct}%):</span>
                <span className="font-mono text-white">{formatoEuros(totales.ivaImporteCéntimos)}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-200">
                  Total Presupuesto:
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#ecb613] font-mono">
                  {formatoEuros(totales.totalCéntimos)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Firma & Depósito Stripe 100€ */}
        <section data-seccion="firma" className="mt-8 rounded-2xl border border-white/10 bg-[#07070b] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white font-syne">
                Formalización y Bloqueo de Fecha
              </h3>
              <p className="mt-1 text-xs text-neutral-400 max-w-lg">
                Bloquea el rider técnico y los artistas para el <strong>{propuesta.cliente.fechaEvento}</strong> en <strong>{propuesta.cliente.fincaOEspacio}</strong> formalizando la fianza de 100 € en Stripe bajo Price-Lock SHA-256.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {propuesta.estado !== 'ganado' ? (
                <button
                  onClick={() => setIsSigningOpen(true)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-[#ecb613]" />
                  1. Firmar Digitalmente
                </button>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Firmado el {propuesta.firma?.fecha} a las {propuesta.firma?.hora}
                </div>
              )}

              <button
                onClick={handleStripeCheckout}
                className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#d8a40f] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ecb613]/20 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Bloquear Fecha (100 € Stripe)
              </button>
            </div>
          </div>
        </section>

        {/* Modal de Firma Manuscrita */}
        {isSigningOpen && (
          <ProposalSignatureCanvas
            token={propuesta.token}
            totalFormateado={formatoEuros(totales.totalCéntimos)}
            onFirmadoExitoso={handleSignatureSuccess}
            onCancelar={() => setIsSigningOpen(false)}
          />
        )}

        {/* Modal de Dudas y Preguntas con Alerta Directa a Telegram */}
        {isQuestionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#09090d] p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#ecb613]" />
                  <h3 className="text-base font-bold text-white font-syne">
                    ¿Tienes Dudas o Quieres Ajustar Algo?
                  </h3>
                </div>
                <button
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mt-3 text-xs text-neutral-300">
                Escribe tu consulta y el director técnico te responderá al instante. También pausará los recordatorios automáticos de esta propuesta.
              </p>

              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ejemplo: ¿Podemos cambiar la hora de inicio del cóctel? ¿Tenéis opción de saxofonista para la barra libre?"
                rows={4}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#050508] p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]"
              />

              {questionSentSuccess ? (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Consulta recibida! Te contactamos en breve.
                </div>
              ) : (
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSendQuestion}
                    disabled={!questionText.trim() || sendingQuestion}
                    className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${
                      questionText.trim() && !sendingQuestion
                        ? 'bg-[#ecb613] text-black hover:bg-[#d8a40f] cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sendingQuestion ? 'Enviando...' : 'Enviar Consulta'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
