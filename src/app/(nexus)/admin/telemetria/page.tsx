"use client";

import { useCallback, useEffect, useState } from "react";

type Telemetry = {
  timestamp: string;
  host: { platform: string; arch: string; hostname: string; node: string; uptimeSec: number };
  cpu: { model: string; cores: number; loadAvg: number[] };
  memory: { totalMB: number; usedMB: number; freeMB: number; usedPct: number };
  vram: { totalMB: number; usedMB: number } | null;
  network: { activeIps: string[] };
  ollama: { online: boolean; models: string[]; latencyMs: number };
  payments: { stripeConfigured: boolean; webhookConfigured: boolean };
  responseMs: number;
};

const CYAN = "#00E5FF";

function fmtMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: ok ? CYAN : "#FF2B44", boxShadow: `0 0 8px ${ok ? CYAN : "#FF2B44"}` }}
      />
      <span className="font-mono text-xs text-white/70">{label}</span>
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  pct,
}: {
  title: string;
  value: string;
  sub?: string;
  pct?: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">{title}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-1 font-mono text-xs text-white/50">{sub}</p>}
      {typeof pct === "number" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: CYAN }}
          />
        </div>
      )}
    </div>
  );
}

export default function TelemetriaPage() {
  const [data, setData] = useState<Telemetry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/telemetry", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Telemetry;
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de telemetría");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="w-full overflow-x-hidden px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: CYAN }}>
            B5.44 · Telemetría Bare-Metal
          </p>
          <h1 className="mt-3 font-sans text-4xl font-bold text-white">Panel de Telemetría Global</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/50">
            Métricas en vivo del host: CPU, RAM, VRAM, motor Ollama (GPU local) y pasarela de pagos.
            Refresco automático cada 10 s.
          </p>
        </header>

        {loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050507] p-6">
            <span className="h-3 w-3 animate-pulse rounded-full" style={{ backgroundColor: CYAN }} />
            <span className="font-mono text-sm text-white/60">Conectando al host…</span>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-[#FF2B44]/40 bg-[#FF2B44]/5 p-6">
            <p className="font-mono text-sm text-[#FF2B44]">Sin señal de telemetría: {error}</p>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-6 rounded-2xl border border-white/10 bg-[#050507] p-5">
              <StatusDot ok={data.ollama.online} label={`OLLAMA ${data.ollama.online ? "ONLINE" : "OFFLINE"}`} />
              <StatusDot ok={data.payments.stripeConfigured} label="STRIPE" />
              <StatusDot ok={data.payments.webhookConfigured} label="WEBHOOK" />
              <span className="ml-auto font-mono text-xs text-white/40">
                {data.host.hostname} · {data.host.platform}/{data.host.arch} · Node {data.host.node}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="CPU"
                value={`${data.cpu.cores} núcleos`}
                sub={data.cpu.model}
              />
              <MetricCard
                title="Carga media (1/5/15 min)"
                value={data.cpu.loadAvg.join(" · ")}
                sub="loadavg"
              />
              <MetricCard
                title="RAM"
                value={`${fmtMB(data.memory.usedMB)} / ${fmtMB(data.memory.totalMB)}`}
                sub={`${data.memory.usedPct}% en uso`}
                pct={data.memory.usedPct}
              />
              <MetricCard
                title="VRAM (GPU)"
                value={data.vram ? fmtMB(data.vram.totalMB) : "N/D"}
                sub={data.vram ? "AMD RX 7900 XTX" : "sin lectura"}
              />
              <MetricCard
                title="Ollama · modelos"
                value={String(data.ollama.models.length)}
                sub={data.ollama.online ? `${data.ollama.latencyMs} ms` : "offline"}
              />
              <MetricCard
                title="Uptime host"
                value={`${Math.floor(data.host.uptimeSec / 3600)} h ${Math.floor((data.host.uptimeSec % 3600) / 60)} min`}
                sub={`respuesta ${data.responseMs} ms`}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#050507] p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">Modelos Ollama cargados</p>
              {data.ollama.models.length === 0 ? (
                <p className="mt-2 font-mono text-sm text-white/40">Sin modelos detectados en 127.0.0.1:11434</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.ollama.models.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-white/70"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-8 text-right font-mono text-[11px] text-white/30">
              Última lectura: {new Date(data.timestamp).toLocaleTimeString("es-ES")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}