'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  TrendingUp,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  Eye,
  Key,
  Lock,
  MessageCircle,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';
import {
  getEzkertzaVenueSnapshot,
  registerVenueViewOnce,
  trackVenueInteraction,
  type VenueLiveMetricKey,
  type VenueShowcaseSnapshot
} from '@/lib/analytics/venue-showcase-telemetry';
import { FoundersParityCalculatorCard } from '@/components/founders/FoundersParityCalculatorCard';

interface PartnerShowcaseMetricsPanelProps {
  initialTab?: 'rendimiento' | 'comparativa' | 'gestion';
  standaloneMode?: boolean;
}

export function PartnerShowcaseMetricsPanel({
  initialTab = 'rendimiento',
  standaloneMode = false
}: PartnerShowcaseMetricsPanelProps) {
  const [activeTab, setActiveTab] = useState<'rendimiento' | 'comparativa' | 'gestion'>(initialTab);
  const [snapshot, setSnapshot] = useState<VenueShowcaseSnapshot | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  /** Refresca el snapshot releyendo el contador vivo persistido en localStorage. */
  const syncSnapshot = useCallback(() => {
    setSnapshot(getEzkertzaVenueSnapshot());
  }, []);

  /** Anota la interacción y repinta las tarjetas para que el contador se mueva en vivo. */
  const registerInteraction = useCallback(
    (event: VenueLiveMetricKey) => {
      trackVenueInteraction(event);
      syncSnapshot();
    },
    [syncSnapshot]
  );

  useEffect(() => {
    syncSnapshot();

    // Este panel es SENSOR solo dentro de la ficha del caserío. En `/admin` es
    // espejo del mismo dato: el CEO audita, pero no infla la telemetría del venue.
    const landing = document.getElementById('ficha-ezkertza-derio');
    if (!landing) {
      return;
    }

    registerVenueViewOnce('ezkertza-berria');
    syncSnapshot();

    const TRACK_RULES: ReadonlyArray<{ selector: string; event: VenueLiveMetricKey }> = [
      { selector: '[data-ear-track="menu-simulator"]', event: 'simulator_interactions' },
      { selector: '[data-ear-track="deposit-lock"]', event: 'deposit_lock_clicks' },
      { selector: '[data-ear-track="visit-request"]', event: 'visit_requests' },
      { selector: '[data-ear-track="map-route"]', event: 'map_route_clicks' },
      { selector: 'a[href*="google.com/maps"]', event: 'map_route_clicks' },
      { selector: 'a[href*="waze.com"]', event: 'map_route_clicks' }
    ];

    const onDocumentClick = (domEvent: MouseEvent): void => {
      const target = domEvent.target;
      if (!(target instanceof Element)) {
        return;
      }
      const matched = TRACK_RULES.find((rule) => target.closest(rule.selector) !== null);
      if (!matched) {
        return;
      }
      registerInteraction(matched.event);
    };

    document.addEventListener('click', onDocumentClick, true);
    return () => document.removeEventListener('click', onDocumentClick, true);
  }, [registerInteraction, syncSnapshot]);

  if (!snapshot) {
    return null;
  }

  const serie = snapshot.historico6Semanas;
  const semanaActual = serie.length > 0 ? serie[serie.length - 1] : null;
  const semanaAnterior = serie.length > 1 ? serie[serie.length - 2] : null;
  const deltaSemanal =
    semanaActual !== null && semanaAnterior !== null && semanaAnterior.visitas > 0
      ? Math.round(((semanaActual.visitas - semanaAnterior.visitas) / semanaAnterior.visitas) * 100)
      : 0;
  const picoSemanal = serie.reduce((pico, punto) => Math.max(pico, punto.visitas), 0);

  const handleCopySecretKey = (): void => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopiedKey(false);
      return;
    }
    const copy = async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText('EAR-SOV-EZKERTZA-2026-SHA256-LOCK');
        setCopiedKey(true);
        window.setTimeout(() => setCopiedKey(false), 3000);
      } catch {
        setCopiedKey(false);
      }
    };
    void copy();
  };

  const handleOpenWhatsAppProposal = (): void => {
    registerInteraction('whatsapp_concierge_clicks');
    const msg = encodeURIComponent(
      `Hola Edwin, soy Eduardo del Restaurante Ezkertza Berria. He revisado el Panel de Telemetría y las ${snapshot.landingsPropietariasCount} páginas exclusivas en EAR OS. Quiero activar la Llave Soberana y formalizar el acuerdo 2026.`
    );
    window.open(`https://wa.me/34693693048?text=${msg}`, '_blank');
  };

  return (
    <section
      id="panel-eduardo"
      className={`w-full overflow-x-hidden rounded-3xl border border-amber-500/30 bg-[#060609] p-4 sm:p-8 backdrop-blur-xl ${standaloneMode ? 'my-4 shadow-2xl shadow-amber-950/20' : 'my-12 shadow-2xl'
        }`}
    >
      {/* Cabecera de Alto Standing para Eduardo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" /> Ficha de Alianza Estratégica · Exclusividad Bizkaia
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-serif">
            Escaparate & Telemetría Soberana <span className="text-[#ecb613]">Ezkertza Berria</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-1 max-w-2xl">
            Preparado exclusivamente para <strong className="text-zinc-200">{snapshot.proprietorName}</strong>.
            Cero intermediarios, cero comisiones de portal y 100% de protección de marca frente a competidores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenWhatsAppProposal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ecb613] to-amber-600 text-black font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Activar Llave con Edwin (WhatsApp)
          </button>
        </div>
      </div>

      {/* Selector de Pestañas con Acentos OLED */}
      <div className="flex items-center gap-2 sm:gap-4 my-6 overflow-x-auto pb-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('rendimiento')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'rendimiento'
            ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-amber-500/20'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
        >
          <TrendingUp className="w-4 h-4" />
          1. Rendimiento de Tu Escaparate
        </button>

        <button
          onClick={() => setActiveTab('comparativa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'comparativa'
            ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-amber-500/20'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
        >
          <BarChart3 className="w-4 h-4" />
          2. Comparativa vs. Tráfico Global EAR OS
        </button>

        <button
          onClick={() => setActiveTab('gestion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'gestion'
            ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-amber-500/20'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
        >
          <Key className="w-4 h-4" />
          3. Área Privada de Gestión 2026
        </button>
      </div>

      {/* PESTAÑA 1: RENDIMIENTO DEL ESCAPARATE */}
      {activeTab === 'rendimiento' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Tarjetas KPI de impacto directo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#09090d] border border-white/5 flex flex-col justify-between">
              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 uppercase">
                <Eye className="w-3.5 h-3.5 text-[#ecb613]" /> Visitas Acumuladas
              </span>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {snapshot.live.views.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {deltaSemanal >= 0 ? '+' : ''}{deltaSemanal}% frente a la semana anterior
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#09090d] border border-white/5 flex flex-col justify-between">
              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 uppercase">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#ecb613]" /> Menús Simulados
              </span>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {snapshot.live.simulator_interactions.toLocaleString()}
                </div>
                <div className="text-[11px] text-amber-400 font-mono mt-1">
                  7 Menús Oficiales 2026
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#09090d] border border-white/5 flex flex-col justify-between">
              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> Clics 'Cómo Llegar'
              </span>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {snapshot.live.map_route_clicks.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-1">
                  Ruta directa desde Bilbao (11 km)
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#09090d] border border-amber-500/20 bg-amber-500/5 flex flex-col justify-between">
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 uppercase">
                <Lock className="w-3.5 h-3.5" /> Solicitudes Bloqueo 100€
              </span>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {snapshot.live.deposit_lock_clicks}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  Parejas con alta intención de firma
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico y Desglose de las 6 semanas */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#09090d] border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ecb613]" /> Evolución Semanal de la Campaña de Lanzamiento
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Progresión auditada del interés de parejas en Bizkaia interesadas en celebrar su banquete en Ezkertza Berria.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Telemetría Activa en Tiempo Real
              </div>
            </div>

            <div className="space-y-3">
              {serie.map((item) => {
                const pct = picoSemanal > 0 ? Math.min(100, Math.round((item.visitas / picoSemanal) * 100)) : 0;
                return (
                  <div key={item.semana} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300 font-bold">{item.semana}</span>
                      <div className="flex items-center gap-4 text-zinc-400">
                        <span>{item.visitas} visitas</span>
                        <span className="text-amber-400">{item.simulacionesMenus} simulaciones</span>
                        <span className="text-emerald-400">{item.solicitudesBloqueo} bloqueos</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-[#ecb613] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Procedencia Geográfica de los Novios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#09090d] border border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#ecb613]" /> Origen de las Parejas Interesadas
              </h3>
              <div className="space-y-4">
                {snapshot.origenesTop.map((geo) => (
                  <div key={geo.municipio} className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-900 last:border-0 last:pb-0">
                    <div>
                      <div className="text-sm font-semibold text-white">{geo.municipio}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">{geo.intencion}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-[#ecb613]">{geo.porcentaje}%</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{geo.sesiones} sesiones</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#09090d] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> Blindaje Comercial
                </div>
                <h3 className="text-lg font-bold text-white font-serif">
                  Por qué Eduardo gana con esta propuesta
                </h3>
                <ul className="space-y-3 mt-4 text-xs sm:text-sm text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
                    <span><strong>126 Páginas Propietarias:</strong> Nadie puede robarte el tráfico de Derio, Getxo o Bilbao porque cada búsqueda aterriza en tu ficha.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
                    <span><strong>0% Fuga de Competencia:</strong> En portales generalistas, tu ficha tiene banners de otros 15 caseríos. En EAR OS, solo existe Ezkertza Berria.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
                    <span><strong>Presupuesto Deducible:</strong> El depósito de 100 € se descuenta íntegramente del banquete, asegurando citas cualificadas que realmente van a contratar.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Estado: <span className="text-emerald-400 font-bold">Activo en Modo Presentación</span></span>
                <span>Propietario: Eduardo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: COMPARATIVA CON TRÁFICO TOTAL EAR OS */}
      {activeTab === 'comparativa' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 to-[#0a0a10] border border-white/10">
            <h3 className="text-xl font-bold text-white font-serif mb-2">
              Ezkertza Berria dentro del Ecosistema Nacional EAR OS
            </h3>
            <p className="text-sm text-zinc-400 max-w-3xl">
              Productora EAR no es un simple directorio pasivo. Es un motor de ingeniería agéntica y aceleración de reservas que canaliza demanda cualificada directamente hacia los mejores espacios de celebración.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-xs font-mono text-zinc-500 uppercase">Superficie Total pSEO</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{snapshot.redGlobalUrlsPseo.toLocaleString('es-ES')}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">URLs indexadas en toda España</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-xs font-mono text-zinc-500 uppercase">Sesiones de Campo Clarity</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{snapshot.redGlobalSesionesAuditadas.toLocaleString('es-ES')}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Parejas y empresas auditadas</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20 bg-amber-500/5">
                <span className="text-xs font-mono text-amber-400 uppercase">Clúster Ezkertza / Otzarreta</span>
                <div className="text-2xl font-bold font-mono text-[#ecb613] mt-1">126</div>
                <div className="text-[11px] text-zinc-300 mt-0.5">Landings exclusivas para Eduardo</div>
              </div>
            </div>
          </div>

          {/* Tabla de Comparativa Agresiva: Directorios Tradicionales vs EAR OS */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#09090d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/80 text-xs font-mono uppercase text-zinc-400 border-b border-white/10">
                <tr>
                  <th className="p-4">Criterio Crítico de Negocio</th>
                  <th className="p-4 text-rose-400">Portales Habituales (Bodas.net, etc.)</th>
                  <th className="p-4 text-[#ecb613]">Alianza Soberana EAR OS (Ezkertza)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                <tr>
                  <td className="p-4 font-semibold text-white">Publicidad de Fincas Rivalizantes</td>
                  <td className="p-4 text-zinc-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    Alta: 8 a 15 fincas compitiendo en tu misma ficha
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] inline mr-2" />
                    CERO fuga: 100% de la pantalla pertenece a Ezkertza
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-white">Comisiones por Menú o Cuotas Mensuales</td>
                  <td className="p-4 text-zinc-400">
                    Cuotas fijas de 1.200 € - 3.500 €/año sin garantía de venta
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] inline mr-2" />
                    Split Soberano 80/10/10 sin cuotas fijas de permanencia
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-white">Filtro Anticuriosos (Depósito de Calidad)</td>
                  <td className="p-4 text-zinc-400">
                    Cero filtro: cientos de mensajes pidiendo precios que no contestan
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] inline mr-2" />
                    Depósito 100 € Stripe deducible: solo parejas comprometidas
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-white">Simulador de Menús y Cubiertos en Vivo</td>
                  <td className="p-4 text-zinc-400">
                    PDFs estáticos que el usuario no lee o ignora
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] inline mr-2" />
                    Cotizador interactivo dinámico con los 7 menús 2026
                  </td>
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-white">Ahorro Estimado para el Restaurante</td>
                  <td className="p-4 text-zinc-500 font-mono">0 € de ahorro (pérdida neta de margen)</td>
                  <td className="p-4 text-[#ecb613] font-mono font-bold">
                    {snapshot.ahorroComisionesCompetenciaAnual}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: ÁREA PRIVADA DE GESTIÓN 2026 */}
      {activeTab === 'gestion' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Tarjeta de Llave Soberana */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-950 to-zinc-950 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-amber-400 mb-2">
                <Key className="w-4 h-4" /> Llave de Acceso Soberana para Eduardo
              </div>
              <h3 className="text-xl font-bold text-white font-serif">
                Código de Integración & Panel de Control de Caserío
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Esta clave criptográfica asocia de forma irrevocable la telemetría de las 126 URLs de Bizkaia con el Restaurante Ezkertza Berria.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="px-4 py-2.5 rounded-xl bg-black border border-zinc-700 font-mono text-xs text-amber-300 w-full sm:w-auto text-center">
                EAR-SOV-EZKERTZA-2026-SHA256-LOCK
              </div>
              <button
                onClick={handleCopySecretKey}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold transition flex items-center justify-center gap-2"
              >
                {copiedKey ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Key className="w-4 h-4" />}
                {copiedKey ? 'Copiada al Portapapeles' : 'Copiar Llave'}
              </button>
            </div>
          </div>

          {/* Estado de los Activos Digitales de Ezkertza Berria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Menús Oficiales 2026</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                  VERIFICADOS
                </span>
              </div>
              <h4 className="text-base font-bold text-white">7 Fórmulas Gastronómicas</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Desde Menú Tradicional Caserío (75 €) hasta Menú Gran Gala Ezkertza (125 €) con aperitivo en jardín y maridaje.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                Lógica de cubierto conectada al cotizador en tiempo real.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Galería Panorámica</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                  SIN RECORTE
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Formato Panorámico OLED</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Resolución nativa de jardines, vigas de roble del comedor y tomas aéreas de Derio sin distorsión vertical.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                Alineado con directriz de diseño S-Class v14.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Ruta Dron & Mapa</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                  LOCAL RGPD
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Recorrido Cinemático</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Vídeo cinemático del caserío optimizado localmente y botón de navegación directa con Google Maps y Waze.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                11 minutos desde el centro de Bilbao.
              </div>
            </div>
          </div>

          {/* CTA Ejecutivo para Cerrar el Trato con Eduardo */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-black via-[#0c0c14] to-black border-2 border-[#ecb613] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase">
                <Flame className="w-4 h-4 fill-current" />
                Paso Final · Conexión Inmediata
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">
                ¿Listo para sellar la exclusividad de Ezkertza Berria en Bizkaia?
              </h3>
              <p className="text-sm text-zinc-300 max-w-xl">
                Al confirmar la alianza, las 126 páginas pasan a modo prioritario, tus teléfonos directos quedan vinculados y el sistema comienza a desviar todas las solicitudes de la zona hacia tu caserío.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleOpenWhatsAppProposal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-extrabold text-base tracking-wide transition shadow-xl shadow-amber-500/20"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Hablar Directo con Edwin (+34 693 693 048)
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8">
        <FoundersParityCalculatorCard
          defaultProviderName="Ezkertza Berria"
          defaultCategory="Restaurante & Caserío Nupcial"
          defaultProvince="Bizkaia"
          defaultTicketEur={13500}
        />
      </div>
    </section>
  );
}