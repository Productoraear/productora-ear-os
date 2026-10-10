'use client';

import React, { useState, useEffect, Suspense, Component, ReactNode, ErrorInfo } from 'react';
import {
  Trophy,
  Swords,
  Sparkles,
  ThumbsUp,
  Flame,
  Cpu,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_ARENA_LEADERBOARD, ArenaVariant } from '@/lib/arena/arena-conversion-engine';
import { BANANA_MASTER_GALLERY } from '@/lib/media/banana-prompts-gallery';

/* ============================================================
 * ERROR BOUNDARY — S-Class OLED (#030305)
 * ============================================================ */

interface ArenaErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ArenaErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class ArenaErrorBoundary extends Component<ArenaErrorBoundaryProps, ArenaErrorBoundaryState> {
  constructor(props: ArenaErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): ArenaErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[ArenaErrorBoundary]', error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#FF2B44]/40 bg-[#0a0508] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#FF2B44] text-xs font-mono font-bold tracking-widest uppercase">
              <AlertTriangle className="w-4 h-4" /> Arena Runtime Fault
            </div>
            <h2 className="text-xl font-extrabold text-white font-syne">
              {this.props.fallbackTitle ?? 'Fallo en el módulo Arena'}
            </h2>
            <p className="text-neutral-400 text-sm font-mono break-all">
              {this.state.errorMessage ?? 'Error desconocido en el subsistema Arena.'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ecb613] hover:bg-[#d4a311] text-black font-bold font-mono rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ============================================================
 * SKELETON LOADER — OLED
 * ============================================================ */

function ArenaSkeleton(): React.ReactElement {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans animate-pulse">
      <div className="border-b border-neutral-800 pb-6 space-y-3">
        <div className="h-3 w-48 bg-neutral-800 rounded" />
        <div className="h-8 w-3/4 bg-neutral-800 rounded" />
        <div className="h-3 w-2/3 bg-neutral-900 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-56 bg-[#08080c] border border-neutral-800 rounded-2xl" />
        <div className="h-56 bg-[#08080c] border border-neutral-800 rounded-2xl" />
      </div>
      <div className="h-72 bg-[#09090d]/80 border border-white/10 rounded-3xl" />
      <div className="h-72 bg-[#09090d]/80 border border-white/10 rounded-3xl" />
    </div>
  );
}

/* ============================================================
 * DASHBOARD — ARENA
 * ============================================================ */

function AdminArenaDashboardContent(): React.ReactElement {
  const [leaderboard, setLeaderboard] = useState<ArenaVariant[]>(INITIAL_ARENA_LEADERBOARD);
  const [battleA, setBattleA] = useState<ArenaVariant>(INITIAL_ARENA_LEADERBOARD[0]);
  const [battleB, setBattleB] = useState<ArenaVariant>(INITIAL_ARENA_LEADERBOARD[1]);
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [voting, setVoting] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const loadLeaderboard = async (): Promise<void> => {
      try {
        const res = await fetch('/api/arena/vote');
        if (!res.ok) return;
        const json: { leaderboard?: ArenaVariant[] } = await res.json();
        if (!cancelled && json.leaderboard) {
          setLeaderboard(json.leaderboard);
        }
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.warn('Error cargando leaderboard Arena:', e);
        }
      }
    };
    void loadLeaderboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVote = async (winnerId: string): Promise<void> => {
    setVoting(true);
    setLastWinner(winnerId);

    try {
      const res = await fetch('/api/arena/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantAId: battleA.id,
          variantBId: battleB.id,
          winnerId
        })
      });

      if (res.ok) {
        const getRes = await fetch('/api/arena/vote');
        if (getRes.ok) {
          const json: { leaderboard?: ArenaVariant[] } = await getRes.json();
          if (json.leaderboard) {
            setLeaderboard(json.leaderboard);
          }
        }
      }
    } catch (e) {
      if (typeof console !== 'undefined') {
        console.warn('Error votando en Arena:', e);
      }
    } finally {
      setVoting(false);
      setTimeout(() => {
        const remaining = leaderboard.filter(
          (v) => v.id !== battleA.id && v.id !== battleB.id
        );
        if (remaining.length >= 2) {
          setBattleA(remaining[0]);
          setBattleB(remaining[1]);
        }
        setLastWinner(null);
      }, 1200);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase mb-1">
            <Swords className="w-4 h-4" /> EAR OS ARENA (ARENA.AI PROTOCOL)
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-syne">
            Torneo Elo de Copys, Imágenes & Conversión 2050
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Optimizador algorítmico de variantes mediante clasificación Elo (arena.ai). Los copys y fotos ganadoras se inyectan en las 23.000 URLs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300">
            <span className="text-[#ecb613] font-bold">K-Factor: 32</span> · Algoritmo Elo Ciego
          </div>
        </div>
      </div>

      {/* ⚔️ ARENA BATTLE PLAYGROUND (SIDE-BY-SIDE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold text-[#ecb613] flex items-center gap-2 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-[#FF2B44]" /> Batalla Activa de Conversión (Side-by-Side)
          </h2>
          <span className="text-xs font-mono text-neutral-500">
            Vota por la variante con mayor poder persuasivo para elevar su ranking Elo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VARIANTE A */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              lastWinner === battleA.id
                ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                : 'border-neutral-800 bg-[#08080c] hover:border-[#ecb613]/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-neutral-800 text-white rounded-lg text-xs font-mono font-bold">
                  VARIANTE A · {battleA.type}
                </span>
                <span className="text-xs font-mono text-[#ecb613] font-extrabold">
                  Elo: {battleA.eloRating}
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white leading-relaxed mb-6 font-syne">
                &quot;{battleA.content}&quot;
              </p>
            </div>

            <button
              onClick={() => void handleVote(battleA.id)}
              disabled={voting}
              className="w-full py-3 bg-[#ecb613] hover:bg-[#d4a311] text-black font-bold font-mono rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              <ThumbsUp className="w-4 h-4" /> Votar Variante A (Mejor Conversión)
            </button>
          </div>

          {/* VARIANTE B */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              lastWinner === battleB.id
                ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                : 'border-neutral-800 bg-[#08080c] hover:border-cyan-500/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-neutral-800 text-white rounded-lg text-xs font-mono font-bold">
                  VARIANTE B · {battleB.type}
                </span>
                <span className="text-xs font-mono text-cyan-400 font-extrabold">
                  Elo: {battleB.eloRating}
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white leading-relaxed mb-6 font-syne">
                &quot;{battleB.content}&quot;
              </p>
            </div>

            <button
              onClick={() => void handleVote(battleB.id)}
              disabled={voting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              <ThumbsUp className="w-4 h-4" /> Votar Variante B (Mejor Conversión)
            </button>
          </div>
        </div>
      </div>

      {/* 🏆 TABLA DE CLASIFICACIÓN ELO (LEADERBOARD) */}
      <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase">
            <Trophy className="w-4 h-4 text-[#ecb613]" /> Leaderboard Elo Oficial de Copys & Bloques
          </h2>
          <span className="text-xs font-mono text-neutral-500">
            Las variantes en Top 1 se inyectan automáticamente en el sitemap
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Nombre</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3">Rating Elo</th>
                <th className="py-2.5 px-3">Partidas</th>
                <th className="py-2.5 px-3">Victorias</th>
                <th className="py-2.5 px-3">Conversión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {leaderboard.map((v, i) => (
                <tr key={v.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#ecb613]">#{i + 1}</td>
                  <td className="py-3 px-3 font-bold text-white max-w-xs truncate">{v.name}</td>
                  <td className="py-3 px-3 text-neutral-400">{v.type}</td>
                  <td className="py-3 px-3 font-black text-[#ecb613]">{v.eloRating}</td>
                  <td className="py-3 px-3 text-neutral-400">{v.matchesPlayed}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{v.wins}</td>
                  <td className="py-3 px-3 font-bold text-white">
                    {(v.conversionRate * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🍌 BANANA PROMPTS XYZ — GALERÍA PEDAGÓGICA NO SATURADA */}
      <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase">
              <ImageIcon className="w-4 h-4 text-[#ecb613]" /> Galería Banana Prompts XYZ (3 a 5 Activos por URL)
            </h2>
            <p className="text-neutral-400 text-xs mt-0.5">
              Fotografía ultra-realista Hasselblad / Leica (35mm f/1.4, golden hour, contraste OLED) para educar y acompañar al cliente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(BANANA_MASTER_GALLERY.fincas).map(([idx, item]) => (
            <div
              key={idx}
              className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[#ecb613] text-[9px] font-mono font-bold rounded">
                  {item.role.toUpperCase()}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-neutral-300 font-medium leading-snug">{item.caption}</p>
                <div className="text-[10px] font-mono text-neutral-500 mt-2 truncate">{item.url}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * PAGE — Suspense + ErrorBoundary Wrapper
 * ============================================================ */

export default function AdminArenaDashboardPage(): React.ReactElement {
  return (
    <ArenaErrorBoundary fallbackTitle="Fallo en el módulo Arena (Admin)">
      <Suspense fallback={<ArenaSkeleton />}>
        <AdminArenaDashboardContent />
      </Suspense>
    </ArenaErrorBoundary>
  );
}