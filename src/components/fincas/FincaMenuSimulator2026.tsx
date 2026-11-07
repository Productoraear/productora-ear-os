'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCA MENU SIMULATOR 2026 & LOGÍSTICA INTEGRAL 1-CLIC (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Ubicación: `src/components/fincas/FincaMenuSimulator2026.tsx`
 * Referencia SSOT: `ORIGINAL_REQUEST.md` (R1, R2, R3, R5) · `PROJECT.md` (M3)
 *
 * Características Clave:
 *  1. Selector reactivo interactivo de menús 2026 (7 menús boda, comuniones, grupos).
 *  2. Control de comensales (pax), kilometraje desde Méntrida Hub (50 km exentos),
 *     hora de fin (hotel a partir de 03:00 AM o > 200 km) y comisión afiliado (10%-15%).
 *  3. Matriz interactiva de los 16 extras y complementos de temporada 2026.
 *  4. Cálculo determinista en céntimos enteros con `calculateFincaEventPricing`.
 *  5. Desglose en vivo de Split Soberano 80/10/10, Rider acústico Ley 37/2003
 *     (< 75 dB SPL, 12 W/pax) y fianza deducible de 100,00 € Stripe Price-Lock.
 *  6. Encargo transaccional en 1-clic despachado al Server Action
 *     `dispatchFincaLogisticsOrderAction` vía `useTransition` con feedback n8n.
 *  7. Estética OLED pura (#030305, #050507, oro #ecb613, layout soberano sin overflow).
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useTransition } from 'react';
import {
  Utensils,
  Check,
  Building2,
  Sparkles,
  Clock,
  MapPin,
  Users,
  Percent,
  Truck,
  Volume2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  AlertCircle,
  X,
  TrendingUp,
  Wine,
  CheckCircle2,
} from 'lucide-react';

import {
  FINCA_BODA_MENUS_2026,
  FINCA_COMUNION_MENUS_2026,
  FINCA_GRUPO_MENUS_2026,
  FINCA_EXTRAS_2026,
  getFincaMenuById,
  type FincaMenuCategory,
} from '@/lib/fincas/fincaMenus2026Catalog';

import {
  calculateFincaEventPricing,
  formatCentsEur,
  type FincaMenuPricingResult,
} from '@/lib/fincas/fincaMenuPricingEngine';

import {
  dispatchFincaLogisticsOrderAction,
  type FincaLogisticsOrderResult,
} from '@/app/actions/fincaLogisticsActions';

import {
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

import {
  SCLASS_12_FINCAS_HOMOLOGADAS,
} from '@/lib/constants/fincas-catalog';

export interface FincaMenuSimulatorProps {
  initialFincaId?: string;
  initialGuestCount?: number;
  initialDistanceKm?: number;
  show100FoundersPactBanner?: boolean;
}

export default function FincaMenuSimulator2026({
  initialFincaId,
  initialGuestCount = 120,
  initialDistanceKm = 45,
  show100FoundersPactBanner = true,
}: FincaMenuSimulatorProps) {
  // ── ESTADOS REACTIVOS PRINCIPALES ──────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<FincaMenuCategory>('bodas');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('boda-cantabrico');
  const [expandedMenuDetails, setExpandedMenuDetails] = useState<boolean>(false);

  const [guestCount, setGuestCount] = useState<number>(initialGuestCount);
  const [distanceKm, setDistanceKm] = useState<number>(initialDistanceKm);
  const [eventEndTime, setEventEndTime] = useState<string>('02:00');
  const [affiliateRate, setAffiliateRate] = useState<number>(0.12);

  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([
    'solista-edwin', // Pre-seleccionado por defecto: Solista Edwin Agudelo (350 € SSOT)
  ]);

  // ── ESTADOS DE LA ORDEN TRANSACCIONAL 1-CLIC ───────────────────────────────
  const [selectedFincaId, setSelectedFincaId] = useState<string>(
    initialFincaId || SCLASS_12_FINCAS_HOMOLOGADAS[0]?.id || 'villa-escorial-park'
  );
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('2026-06-20');
  const [orderNotes, setOrderNotes] = useState<string>('');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<FincaLogisticsOrderResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // ── FILTRADO DE MENÚS SEGÚN CATEGORÍA ──────────────────────────────────────
  const categoryMenus = useMemo(() => {
    switch (selectedCategory) {
      case 'comuniones':
        return FINCA_COMUNION_MENUS_2026;
      case 'grupos':
        return FINCA_GRUPO_MENUS_2026;
      case 'bodas':
      default:
        return FINCA_BODA_MENUS_2026;
    }
  }, [selectedCategory]);

  const selectedMenu = useMemo(
    () => getFincaMenuById(selectedMenuId) || FINCA_BODA_MENUS_2026[0],
    [selectedMenuId]
  );

  const currentFinca = useMemo(
    () => SCLASS_12_FINCAS_HOMOLOGADAS.find((f) => f.id === selectedFincaId),
    [selectedFincaId]
  );

  // Sincronizar distancia si cambia la finca seleccionada en el catálogo
  const handleSelectFinca = (fincaId: string) => {
    setSelectedFincaId(fincaId);
    const targetFinca = SCLASS_12_FINCAS_HOMOLOGADAS.find((f) => f.id === fincaId);
    if (targetFinca && targetFinca.distanciaHubMentridaKm > 0) {
      setDistanceKm(targetFinca.distanciaHubMentridaKm);
    }
  };

  // ── CÁLCULO FINANCIERO REACTIVO DETERMINISTA (CÉNTIMOS ENTEROS) ─────────────
  const pricingResult: FincaMenuPricingResult | null = useMemo(() => {
    try {
      return calculateFincaEventPricing({
        menuId: selectedMenuId,
        guestCount: Math.max(1, guestCount),
        selectedExtraIds,
        distanceKm: Math.max(0, distanceKm),
        eventEndTime,
        affiliateCommissionPct: affiliateRate,
      });
    } catch (err: unknown) {
      console.error('[FincaMenuSimulator2026] Error calculando pricing:', err);
      return null;
    }
  }, [selectedMenuId, guestCount, selectedExtraIds, distanceKm, eventEndTime, affiliateRate]);

  // ── HANDLERS DE INTERACCIÓN ────────────────────────────────────────────────
  const handleToggleExtra = (extraId: string) => {
    setSelectedExtraIds((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const handleCategoryChange = (cat: FincaMenuCategory) => {
    setSelectedCategory(cat);
    const firstMenu = cat === 'bodas'
      ? FINCA_BODA_MENUS_2026[0]
      : cat === 'comuniones'
      ? FINCA_COMUNION_MENUS_2026[0]
      : FINCA_GRUPO_MENUS_2026[0];
    if (firstMenu) {
      setSelectedMenuId(firstMenu.id);
    }
  };

  // ── DISPATCH 1-CLIC LOGÍSTICA VIA SERVER ACTION ────────────────────────────
  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!contactName.trim() || contactName.trim().length < 2) {
      setFormError('Por favor, indique el nombre completo del contacto responsable.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setFormError('Por favor, indique un correo electrónico corporativo o personal válido.');
      return;
    }
    if (!contactPhone.trim() || contactPhone.replace(/\D/g, '').length < 9) {
      setFormError('Por favor, introduzca un teléfono de contacto con al menos 9 dígitos.');
      return;
    }
    if (!eventDate.trim()) {
      setFormError('Indique la fecha prevista del evento.');
      return;
    }

    startTransition(async () => {
      const payload = {
        fincaId: selectedFincaId,
        fincaName: currentFinca?.name || 'Finca Asociada',
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        municipio: currentFinca?.location || 'Méntrida Hub',
        provincia: currentFinca?.provincia || 'España',
        distanceKm,
        menuId: selectedMenuId,
        guestCount,
        selectedExtraIds,
        eventDate,
        eventEndTime,
        affiliateCommissionPct: affiliateRate,
        notes: orderNotes.trim(),
      };

      try {
        const result = await dispatchFincaLogisticsOrderAction(payload);
        setOrderResult(result);
        if (!result.success && result.errors && result.errors.length > 0) {
          setFormError(result.errors.join(' '));
        }
      } catch (err: unknown) {
        console.error('Error despachando orden logística:', err);
        setFormError('Error de conexión despachando la orden a backend. Por favor, reintente.');
      }
    });
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-[#030305] text-white font-sans py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#ecb613] selection:text-black">
      
      {/* ── BANNER PROTOCOLO PACTO 100 FUNDADORES ── */}
      {show100FoundersPactBanner && (
        <aside aria-label="Pacto de los 100 Fundadores" className="mx-auto max-w-7xl mb-8 rounded-2xl border border-[#ecb613]/30 bg-gradient-to-r from-[#09090d] via-[#12110c] to-[#09090d] p-4 text-xs font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#ecb613] animate-pulse" />
              <strong className="text-[#ecb613] uppercase tracking-wider font-bold">
                Pacto de los 100 Fundadores (Temporada 2026)
              </strong>
              <span className="text-white/40 hidden md:inline">• 0% Fuga a Competidores</span>
            </div>
            <div className="flex items-center gap-4 text-white/70 text-[11px]">
              <span>Igualación de Cuota Vitalicia</span>
              <span className="text-emerald-400 font-bold">Comisión Afiliado 10% - 15%</span>
              <span className="hidden lg:inline text-white/40">Liquidación &le; 7 días</span>
            </div>
          </div>
        </aside>
      )}

      {/* ── ENCABEZADO PRINCIPAL DEL SIMULADOR ── */}
      <div className="mx-auto max-w-7xl mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#ecb613]">
          <Sparkles size={13} className="text-[#ecb613]" />
          <span>Motor Gastronómico & Logístico S-Class</span>
        </div>
        <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
          Simulador de Menús 2026 & Logística en 1-Clic
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-3xl leading-relaxed">
          Configure su banquete oficial con los 7 menús canónicos de boda, aforo, distancia y complementos.
          Producción técnica completa delegable en 1-clic con liquidación de comisión de afiliado garantizada en 7 días hábiles.
        </p>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* COLUMNA IZQUIERDA: CONTROLES INTERACTIVOS (7 COLS)                   */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-8">

          {/* 1. SELECCIÓN DE FINCA Y CATEGORÍA GASTRONÓMICA */}
          <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-syne text-lg font-bold uppercase text-white flex items-center gap-2">
                  <Building2 size={18} className="text-[#ecb613]" />
                  <span>1. Espacio & Categoría de Evento</span>
                </h3>
                <p className="font-mono text-xs text-white/50">Seleccione el espacio colaborador y tipo de celebración</p>
              </div>

              {/* Selector de Categoría Gastronómica */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 font-mono text-xs">
                {(['bodas', 'comuniones', 'grupos'] as FincaMenuCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1.5 rounded-lg uppercase font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#ecb613] text-black shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat === 'bodas' ? 'Bodas' : cat === 'comuniones' ? 'Comunión' : 'Grupos'}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Finca Homologada */}
            <div className="space-y-2">
              <label className="block font-mono text-xs text-white/70">
                Finca o Espacio Homologado (Catálogo S-Class):
              </label>
              <select
                value={selectedFincaId}
                onChange={(e) => handleSelectFinca(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ecb613] outline-none font-sans cursor-pointer"
              >
                {SCLASS_12_FINCAS_HOMOLOGADAS.map((finca) => (
                  <option key={finca.id} value={finca.id}>
                    {finca.name} ({finca.provincia} • {finca.distanciaHubMentridaKm} km del Hub Méntrida)
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* 2. CATÁLOGO DE MENÚS (SELECTOR DE PAQUETE 2026) */}
          <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-syne text-lg font-bold uppercase text-white flex items-center gap-2">
                <Utensils size={18} className="text-[#ecb613]" />
                <span>2. Menús Canónicos de Temporada 2026 ({categoryMenus.length} Disponibles)</span>
              </h3>
              <p className="font-mono text-xs text-white/50">
                Precios por persona en céntimos enteros con desglose de bodega, marisco y platos principales
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categoryMenus.map((menu) => {
                const isSelected = menu.id === selectedMenuId;
                return (
                  <div
                    key={menu.id}
                    onClick={() => setSelectedMenuId(menu.id)}
                    className={`relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#ecb613] bg-gradient-to-b from-[#18160f] to-[#09090d] shadow-lg shadow-[#ecb613]/10 ring-1 ring-[#ecb613]'
                        : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-syne font-bold text-sm text-white">{menu.name}</span>
                        {isSelected && (
                          <span className="shrink-0 rounded-full bg-[#ecb613] p-1 text-black">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-[#ecb613] uppercase font-bold">{menu.tag}</p>
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{menu.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                      <div>
                        <strong className="text-white text-sm">{formatCentsEur(menu.pricePerPaxCents)}</strong>
                        <span className="text-white/40 text-[10px]"> / pax</span>
                      </div>
                      {menu.bonus && (
                        <span className="text-[10px] text-amber-300 font-bold truncate max-w-[140px]" title={menu.bonus}>
                          {menu.bonus}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ficha Desplegable del Menú Seleccionado */}
            {selectedMenu && (
              <div className="rounded-2xl border border-white/10 bg-black/60 p-5 space-y-4 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Wine size={16} className="text-[#ecb613]" />
                    <span className="font-syne font-bold text-white uppercase text-sm">
                      Ficha Gastronómica: {selectedMenu.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedMenuDetails(!expandedMenuDetails)}
                    className="font-mono text-[11px] text-[#ecb613] hover:underline cursor-pointer"
                  >
                    {expandedMenuDetails ? 'Ocultar composición' : 'Ver composición completa'}
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-white/80"><strong className="text-[#ecb613]">Plato estrella:</strong> {selectedMenu.highlight}</p>
                  <p className="text-white/60"><strong className="text-white/80">Bodega incluida:</strong> {selectedMenu.cellar.join(' • ')}</p>
                  <p className="text-white/60"><strong className="text-white/80">Acústica:</strong> {selectedMenu.soundIncluded}</p>
                </div>

                {expandedMenuDetails && (
                  <div className="pt-3 border-t border-white/10 space-y-3 font-mono text-[11px]">
                    <div>
                      <strong className="text-white block mb-1">Aperitivo & Cóctel de Gala:</strong>
                      <ul className="list-disc list-inside text-white/60 space-y-0.5">
                        {selectedMenu.cocktail.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-white block mb-1">Platos Principales a Elegir:</strong>
                      <div className="space-y-1">
                        {selectedMenu.mainCourses.map((m, i) => (
                          <div key={i} className="text-white/70">
                            <span className="text-[#ecb613] font-bold">• {m.name}:</span> {m.desc}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-white block mb-1">Postre Artesano:</strong>
                      <p className="text-white/70">{selectedMenu.dessert}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 3. PARÁMETROS OPERATIVOS: AFORO, DISTANCIA, HORA Y COMISIÓN */}
          <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-syne text-lg font-bold uppercase text-white flex items-center gap-2">
                <Truck size={18} className="text-[#ecb613]" />
                <span>3. Parámetros Operativos & Logística S-Class</span>
              </h3>
              <p className="font-mono text-xs text-white/50">
                Ajuste comensales, kilometraje del hub y porcentaje de afiliación
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Control de Aforo (Guest Count) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white/70 flex items-center gap-1.5">
                    <Users size={14} className="text-[#ecb613]" /> Aforo de Comensales:
                  </span>
                  <strong className="text-white text-sm">{guestCount} pax</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuestCount((p) => Math.max(1, p - 10))}
                    className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold hover:bg-white/10 cursor-pointer"
                  >
                    -10
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-center text-sm font-mono text-white focus:border-[#ecb613] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setGuestCount((p) => p + 10)}
                    className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold hover:bg-white/10 cursor-pointer"
                  >
                    +10
                  </button>
                </div>

                {/* Chips rápidos de aforo */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[50, 100, 120, 150, 200, 300].map((quickPax) => (
                    <button
                      key={quickPax}
                      type="button"
                      onClick={() => setGuestCount(quickPax)}
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase cursor-pointer ${
                        guestCount === quickPax
                          ? 'bg-[#ecb613] text-black font-bold'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {quickPax}pax
                    </button>
                  ))}
                </div>
              </div>

              {/* Distancia al Hub Méntrida (km) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white/70 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#ecb613]" /> Distancia al Hub Méntrida:
                  </span>
                  <strong className="text-white text-sm">{distanceKm} km</strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="350"
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#ecb613] cursor-pointer"
                />

                <div className="flex justify-between font-mono text-[10px] text-white/40">
                  <span>0 km (Hub)</span>
                  <span className="text-emerald-400 font-bold">&le; 50 km (Exento 0 €)</span>
                  <span>+50 km (1,50 €/km)</span>
                </div>
              </div>

              {/* Hora de Finalización del Evento (Hotel Trigger) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white/70 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#ecb613]" /> Hora de Cierre Prevista:
                  </span>
                  <strong className="text-white text-sm">{eventEndTime} h</strong>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {['23:00', '01:30', '03:00', '05:00'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setEventEndTime(time)}
                      className={`py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        eventEndTime === time
                          ? 'bg-[#ecb613] text-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {pricingResult?.metadata.hotelRequired && (
                  <p className="font-mono text-[10px] text-amber-300 flex items-center gap-1 pt-1">
                    <AlertCircle size={11} /> Suplemento hotelero (+120,00 €) activado por horario o distancia.
                  </p>
                )}
              </div>

              {/* Porcentaje de Afiliación (10% a 15%) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white/70 flex items-center gap-1.5">
                    <Percent size={14} className="text-emerald-400" /> Comisión de Afiliado (Finca):
                  </span>
                  <strong className="text-emerald-400 text-sm">{Math.round(affiliateRate * 100)}%</strong>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0.10, label: '10% (Base)' },
                    { val: 0.12, label: '12% (Partner)' },
                    { val: 0.15, label: '15% (Fundador)' },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => setAffiliateRate(btn.val)}
                      className={`py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        affiliateRate === btn.val
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-white/40 block">
                  Detraída 100% del margen EAR OS. Cero recorte al artista o VIMUME.
                </span>
              </div>

            </div>
          </section>

          {/* 4. CATÁLOGO DE LOS 16 EXTRAS Y COMPLEMENTOS OFICIALES */}
          <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-syne text-lg font-bold uppercase text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-[#ecb613]" />
                  <span>4. Complementos & Extras Oficiales (16 Servicios)</span>
                </h3>
                <p className="font-mono text-xs text-white/50">
                  {selectedExtraIds.length} seleccionados • Servicios integrales coordinados por Productora EAR
                </p>
              </div>

              {selectedExtraIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedExtraIds([])}
                  className="font-mono text-[11px] text-white/40 hover:text-white cursor-pointer self-start sm:self-auto"
                >
                  Deseleccionar todos
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
              {FINCA_EXTRAS_2026.map((extra) => {
                const isSelected = selectedExtraIds.includes(extra.id);
                return (
                  <div
                    key={extra.id}
                    onClick={() => handleToggleExtra(extra.id)}
                    className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected
                        ? 'border-[#ecb613] bg-[#ecb613]/10 text-white'
                        : 'border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-4 w-4 shrink-0 rounded flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#ecb613] text-black' : 'border border-white/30'
                      }`}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-syne text-xs font-bold text-white truncate">{extra.name}</span>
                      </div>
                      <p className="text-[11px] text-white/50 line-clamp-2 leading-tight">{extra.desc}</p>
                      <div className="font-mono text-xs text-[#ecb613] font-bold pt-1">
                        {formatCentsEur(extra.priceCents)}
                        <span className="text-white/40 text-[10px] font-normal">
                          {extra.isPerPax ? ' / pax' : ' (fijo)'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* COLUMNA DERECHA: DASHBOARD DE LIQUIDACIÓN Y ENCARGO 1-CLIC (5 COLS)   */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">

          {/* HERO OUTCOME CARD: TOTALES Y COMISIÓN FINCA */}
          <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-white/50 block">Cotización en Vivo</span>
                <h3 className="font-syne text-xl font-bold uppercase text-white">Presupuesto Consolidado</h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-[10px] font-bold uppercase text-emerald-400">
                SSOT Válido
              </span>
            </div>

            {/* Importes Mayores */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline font-mono text-xs text-white/70">
                <span>Subtotal Neto:</span>
                <span className="text-white text-base font-bold">
                  {pricingResult ? formatCentsEur(pricingResult.subtotalCents) : '...'}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs text-white/50">
                <span>IVA Aplicable (21%):</span>
                <span>{pricingResult ? formatCentsEur(pricingResult.ivaCents) : '...'}</span>
              </div>
              <div className="flex justify-between items-baseline font-mono pt-3 border-t border-white/10">
                <span className="text-white font-bold text-sm uppercase">Total Evento con IVA:</span>
                <span className="font-syne text-2xl sm:text-3xl font-black text-[#ecb613]">
                  {pricingResult ? formatCentsEur(pricingResult.totalWithIvaCents) : '...'}
                </span>
              </div>
            </div>

            {/* TARJETA DE RETORNO PARA LA FINCA (COMISIÓN AFILIADO) */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <TrendingUp size={14} /> Comisión para la Finca ({Math.round(affiliateRate * 100)}%):
                </span>
                <strong className="text-lg text-emerald-300 font-bold">
                  {pricingResult ? formatCentsEur(pricingResult.affiliateCommissionCents) : '...'}
                </strong>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Ingreso neto pasivo liquidable en cuenta en un plazo máximo de <strong>7 días hábiles</strong> vía SEPA.
              </p>
            </div>

            {/* SPLIT SOBERANO 80/10/10 (DETERMINISTA HARE-NIEMEYER) */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-white/60">
                <span className="uppercase text-[10px] tracking-wider text-white/40">Split Soberano 80/10/10:</span>
                <span className="text-[10px] text-[#ecb613]">Sin Comisiones Ocultas</span>
              </div>

              {/* Barra de Distribución Visual */}
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden flex">
                <div style={{ width: '80%' }} className="bg-[#ecb613] h-full" title="80% Artista / Proveedores" />
                <div style={{ width: '10%' }} className="bg-[#00E5FF] h-full" title="10% EAR OS Infraestructura" />
                <div style={{ width: '10%' }} className="bg-pink-500 h-full" title="10% VIMUME Impacto Social" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                <div>
                  <span className="text-white/40 block">80% Artista:</span>
                  <strong className="text-white truncate block">
                    {pricingResult ? formatCentsEur(pricingResult.split.artistaCents) : '...'}
                  </strong>
                </div>
                <div>
                  <span className="text-white/40 block">10% EAR OS:</span>
                  <strong className="text-[#00E5FF] truncate block">
                    {pricingResult ? formatCentsEur(pricingResult.split.earOsCents) : '...'}
                  </strong>
                </div>
                <div>
                  <span className="text-white/40 block">10% VIMUME:</span>
                  <strong className="text-pink-400 truncate block">
                    {pricingResult ? formatCentsEur(pricingResult.split.vimumeCents) : '...'}
                  </strong>
                </div>
              </div>
            </div>

            {/* RIDER ACÚSTICO LEY 37/2003 */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/70 flex items-center gap-1.5">
                  <Volume2 size={13} className="text-[#00E5FF]" /> Rider Acústico Certificado:
                </span>
                <span className="text-[10px] rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 font-bold">
                  &lt; 75 dB SPL (Ley 37/2003)
                </span>
              </div>
              <div className="text-[11px] text-white/50">
                Potencia requerida: <strong className="text-white">{pricingResult?.acousticRider.recommendedWatts} W RMS</strong> (12 W/pax).
              </div>
              <div className="text-[10px] text-white/40 truncate">
                Sistema: {pricingResult?.acousticRider.systemRecommended}
              </div>
            </div>

            {/* RECORDATORIO FIANZA DEDUCIBLE 100 € */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/70 flex items-center gap-1.5">
                  <CreditCard size={13} className="text-[#ecb613]" /> Bloqueo con Depósito Deducible:
                </span>
                <strong className="text-[#ecb613]">{DEPOSITO_STRIPE_EUR},00 €</strong>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed">
                100% deducible de la liquidación final. Saldo pendiente tras reserva: <strong>{pricingResult ? formatCentsEur(pricingResult.metadata.pendingBalanceWithIvaCents) : '...'}</strong>.
              </p>
            </div>

            {/* BOTÓN MAESTRO: ENCARGAR LOGÍSTICA EN 1-CLIC */}
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-[#ecb613] text-black font-syne text-sm font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>⚡ Encargar Logística Integral en 1-Clic</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-4 text-center font-mono text-[10px] text-white/40">
              <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-emerald-400" /> Sello SHA-256</span>
              <span>•</span>
              <span>Despacho Inmediato n8n</span>
              <span>•</span>
              <a href={`tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`} className="hover:text-white underline">
                Centralita {CENTRALITA_EAR_OS}
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL DE ENCARGO DE LOGÍSTICA EN 1-CLIC & CONFIRMACIÓN              */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#09090d] p-6 sm:p-8 space-y-6 shadow-2xl my-8">

            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={() => {
                setIsOrderModalOpen(false);
                setOrderResult(null);
                setFormError(null);
              }}
              className="absolute top-6 right-6 text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header del Modal */}
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ecb613] font-bold">
                Transacción B2B Directa
              </span>
              <h3 className="font-syne text-2xl font-black uppercase text-white">
                Encargo de Logística Integral 1-Clic
              </h3>
              <p className="text-xs text-white/60">
                Espacio: <strong className="text-white">{currentFinca?.name}</strong> • Menú: <strong className="text-[#ecb613]">{selectedMenu.name}</strong> ({guestCount} pax)
              </p>
            </div>

            {/* FORMULARIO DE DESPACHO (SI NO SE HA CONFIRMADO AÚN) */}
            {!orderResult?.success ? (
              <form onSubmit={handleExecuteOrder} className="space-y-4">

                {formError && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs font-mono text-rose-300 flex items-start gap-2">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-white/70 mb-1">Nombre del Responsable / Director *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Marcos Hurtado"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-white/70 mb-1">Email de Contacto *</label>
                    <input
                      type="email"
                      required
                      placeholder="director@finca.es"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-white/70 mb-1">Teléfono Directo / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+34 600 000 000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-white/70 mb-1">Fecha Prevista del Evento *</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#ecb613] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-white/70 mb-1">Observaciones Técnicas o Requerimientos Especiales</label>
                  <textarea
                    rows={2}
                    placeholder="Acceso por camino rural, horario de prueba de sonido, acometida CETAC disponible..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:border-[#ecb613] outline-none resize-none"
                  />
                </div>

                {/* Resumen del Encargo */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Presupuesto Estimado con IVA:</span>
                    <strong className="text-[#ecb613]">{pricingResult ? formatCentsEur(pricingResult.totalWithIvaCents) : '...'}</strong>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Comisión Finca ({Math.round(affiliateRate * 100)}%):</span>
                    <strong className="text-emerald-400">{pricingResult ? formatCentsEur(pricingResult.affiliateCommissionCents) : '...'}</strong>
                  </div>
                  <div className="flex justify-between text-white/50 text-[11px] pt-1 border-t border-white/5">
                    <span>Fianza Deducible de Bloqueo:</span>
                    <span>{DEPOSITO_STRIPE_EUR},00 € (100% descontable)</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-white/10 font-mono text-xs text-white/70 hover:bg-white/5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-syne text-xs font-black uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <span className="h-3 w-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        <span>Despachando a n8n...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirmar Encargo Logístico</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* VISTA DE CONFIRMACIÓN TRAS ÉXITO */
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-widest">
                    Orden Transaccional Confirmada
                  </span>
                  <h4 className="font-syne text-2xl font-black text-white">
                    {orderResult.orderId}
                  </h4>
                  <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                    {orderResult.message}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 max-w-md mx-auto space-y-2 text-left font-mono text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Estado:</span>
                    <span className="text-emerald-400 font-bold">{orderResult.status}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>SLA de Coordinación Técnica:</span>
                    <span className="text-white">&le; {orderResult.nextSteps?.slaHours ?? 24} horas</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Centralita Directa:</span>
                    <a href={`tel:${(orderResult.nextSteps?.coordinationPhone || CENTRALITA_EAR_OS).replace(/\s+/g, '')}`} className="text-[#ecb613] font-bold">
                      {orderResult.nextSteps?.coordinationPhone || CENTRALITA_EAR_OS}
                    </a>
                  </div>
                  <div className="flex justify-between text-white/70 pt-2 border-t border-white/5">
                    <span>Despacho Asíncrono n8n:</span>
                    <span className="text-emerald-400">Activo (webhook encolado)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOrderModalOpen(false);
                    setOrderResult(null);
                  }}
                  className="px-8 py-3 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black font-mono text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
                >
                  Cerrar y Continuar Simulando
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
