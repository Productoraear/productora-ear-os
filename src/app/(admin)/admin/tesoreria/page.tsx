"use client";

import {
  useState,
  useEffect,
  useCallback,
  Suspense,
  Component,
  type ReactNode,
  type ErrorInfo,
} from 'react';
import {
  CreditCard,
  Lock,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Landmark,
  Wallet,
  AlertTriangle,
  Send,
  Download,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { z } from 'zod';
import {
  SPLIT_SOBERANO,
  DEPOSITO_STRIPE_EUR,
  DEPOSITO_RESERVA_EUR,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  executeStripeCheckout,
  executeWebhookN8n,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

/* ========================================================================== */
/* CONTRATO DE DATOS ZOD ESTRICTO (NIVEL 5)                                   */
/* ========================================================================== */

export const TreasuryMetricsSchema = z
  .object({
    totalDepositsAmount: z.string(),
    totalDepositsCount: z.number(),
    artistSplit: z.string(),
    earOsSplit: z.string(),
    vimumeSplit: z.string(),
    rule: z.string(),
  })
  .strict();

export const TreasuryTransactionSchema = z
  .object({
    id: z.string(),
    client: z.string(),
    service: z.string(),
    deposit: z.string(),
    hash: z.string(),
    status: z.string(),
    date: z.string(),
  })
  .strict();

export const TreasuryDataSchema = z
  .object({
    success: z.boolean().optional(),
    metrics: TreasuryMetricsSchema,
    transactions: z.array(TreasuryTransactionSchema),
  })
  .strict();

export type TreasuryData = z.infer<typeof TreasuryDataSchema>;

interface TreasuryErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
}

interface TreasuryErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

class TreasuryErrorBoundary extends Component<
  TreasuryErrorBoundaryProps,
  TreasuryErrorBoundaryState
> {
  constructor(props: TreasuryErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error: Error): TreasuryErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[TESORERIA][ERROR-BOUNDARY]', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, message: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="rounded-3xl bg-[#09090d]/80 border border-red-500/30 p-8 shadow-sm space-y-3 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <h2 className="text-sm font-bold font-syne text-white uppercase">
            Error en el módulo de Tesorería
          </h2>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
            {this.state.message ?? 'Se produjo un error inesperado al renderizar el libro mayor.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-[#ecb613]/50 transition-all text-xs font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ecb613]" />
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function TreasurySkeleton(): ReactNode {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div className="space-y-2">
          <div className="h-3 w-48 rounded bg-zinc-900" />
          <div className="h-7 w-80 rounded bg-zinc-900" />
        </div>
        <div className="h-9 w-40 rounded-xl bg-zinc-900" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 h-32"
          />
        ))}
      </div>
      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 h-64" />
    </div>
  );
}

function TesoreriaAdminCatminContent(): ReactNode {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);

  const fetchTreasury = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/treasury', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rawJson = (await res.json()) as unknown;
      const validated = TreasuryDataSchema.parse(rawJson);
      setData(validated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error('[TESORERIA] Error cargando datos:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTreasury();
  }, [fetchTreasury]);

  const handleStripeCheckout = (): void => {
    const res = executeStripeCheckout({
      eventId: `PLOCK-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Cliente Particular / Depósito Reserva',
      venue: 'Sede Productora EAR',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: DEPOSITO_STRIPE_EUR,
      dimensionId: 'TESORERIA_SPLIT',
      entityContext: resolveEntityContext('e78903', 'ARTISTAS_ESCENARIO'),
      pepitaDeOro: `Fianza deducible Price-Lock de ${DEPOSITO_STRIPE_EUR} €`,
      rawVision: 'Bloqueo oficial de fecha en agenda',
    });
    setActiveResult(res);
  };

  const handleTriggerN8n = async (): Promise<void> => {
    const res = await executeWebhookN8n({
      eventId: `LEDGER-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Conciliación Bancaria Stripe-Ledger',
      venue: 'Producción Central Coolify',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: data ? parseFloat(data.metrics.totalDepositsAmount.replace('.', '').replace(',', '.')) : 0,
      dimensionId: 'TESORERIA_SPLIT',
      entityContext: resolveEntityContext('e78903', 'ARTISTAS_ESCENARIO'),
      pepitaDeOro: 'Conciliación automática céntimo a céntimo',
      rawVision: 'Disparo de sincronización idempotente hacia n8n',
    });
    setActiveResult(res);
  };

  if (error) {
    throw new Error(error);
  }

  const artistPct = Math.round(SPLIT_SOBERANO.artista * 100);
  const earOsPct = Math.round(SPLIT_SOBERANO.earOs * 100);
  const vimumePct = Math.round(SPLIT_SOBERANO.vimume * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Finanzas</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Tesorería &amp; Stripe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Tesorería &amp; Depósitos Price-Lock {DEPOSITO_STRIPE_EUR.toFixed(0)}€
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              void fetchTreasury();
            }}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#ecb613]/50 transition-all"
            title="Sincronizar con Stripe"
          >
            <RefreshCw className={`w-4 h-4 text-[#ecb613] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleStripeCheckout}
            className="px-3 py-1.5 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-[#ecb613]/20"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>+ Stripe Checkout {DEPOSITO_STRIPE_EUR.toFixed(0)}€</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerN8n}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Webhook n8n</span>
          </button>

          <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#ecb613]">
            <Lock className="w-3.5 h-3.5" />
            <span>Split {artistPct}/{earOsPct}/{vimumePct} Inmutable</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI DE TESORERÍA                          */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Señales */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Total Señales Custodia</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {data ? `${data.metrics.totalDepositsAmount} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            {data?.metrics.totalDepositsCount || 0} eventos con fianza Stripe ({DEPOSITO_STRIPE_EUR.toFixed(0)} €)
          </p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Stripe Price-Lock SHA-256 Activo
          </div>
        </div>

        {/* Card 2: Artistas */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Liquidación Artista ({artistPct}%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {data ? `${data.metrics.artistSplit} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Edwin Agudelo y elenco</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Retribución Neta Soberana ({artistPct}%)
          </div>
        </div>

        {/* Card 3: Plataforma EAR OS */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Infraestructura EAR OS ({earOsPct}%)</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#ecb613]">
            {data ? `${data.metrics.earOsSplit} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Pasarela, telemetría y hosting</p>
          <div className="mt-2 flex items-center text-xs font-mono text-[#ecb613] font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cero Cuotas Fijas
          </div>
        </div>

        {/* Card 4: VIMUME */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Impacto VIMUME ({vimumePct}%)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {data ? `${data.metrics.vimumeSplit} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Sesiones 40 Hz Mayores</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Modelo 182 AEAT (80% Deducible)
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. TABLA DE MOVIMIENTOS EN VIVO (ESTILO CATMÍN)                       */}
      {/* ===================================================================== */}
      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Libro Mayor de Señales Stripe Price-Lock
            </h2>
            <p className="text-xs text-zinc-500">
              Conciliación criptográfica SHA-256 válida por 48 horas
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            INMUTABLE
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Cargando libro mayor desde Stripe...
          </div>
        ) : !data?.transactions || data.transactions.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs font-mono text-zinc-400">
              0 depósitos registrados en el Libro Mayor
            </p>
            <p className="text-[11px] text-zinc-600 max-w-md mx-auto">
              Cero cifras de vanidad. Los depósitos de Stripe ({DEPOSITO_STRIPE_EUR.toFixed(0)} €) se registrarán aquí
              automáticamente en tiempo real con su hash SHA-256 una vez sean procesados por la
              pasarela.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {data.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-500 text-[10px]">{tx.id}</span>
                    <span className="font-mono text-[#ecb613] text-[10px] bg-[#ecb613]/10 px-1.5 py-0.2 rounded border border-[#ecb613]/20">
                      {tx.hash}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{tx.client}</div>
                  <div className="text-zinc-400 text-[11px] font-light">{tx.service}</div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono uppercase">
                      DEPÓSITO
                    </span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {tx.deposit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono uppercase">
                      ESTADO
                    </span>
                    <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. MODAL MULTI-RAIL ARTIFACT                                          */}
      {/* ===================================================================== */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  {activeResult.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Artefacto:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Payload / Contenido:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors"
              >
                Cerrar
              </button>
              {activeResult.downloadUrl && (
                <a
                  href={activeResult.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir / Descargar</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TesoreriaAdminCatminPage(): ReactNode {
  return (
    <TreasuryErrorBoundary>
      <Suspense fallback={<TreasurySkeleton />}>
        <TesoreriaAdminCatminContent />
      </Suspense>
    </TreasuryErrorBoundary>
  );
}
