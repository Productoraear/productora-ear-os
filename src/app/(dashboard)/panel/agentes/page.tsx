'use client';

import * as React from 'react';
import Link from 'next/link';

interface AgentTrace {
  to: string;
  intent: string;
  reply: { ok: boolean; summary: string };
}

interface Message {
  sender: 'user' | 'agent';
  text: string;
  traces?: AgentTrace[];
  time: string;
}

interface HardwareInfo {
  platform: string;
  hostname: string;
  architecture: string;
  cpu: { model: string; physicalCores: number; logicalCores: number; speedMhz: number | null };
  memory: { totalBytes: number; freeBytes: number; usedPercent: number };
  loadAverage: number[];
  uptimeSeconds: number;
  nodeVersion: string;
}

interface FleetStatus {
  killSwitch: boolean;
  entryAgentCount: number;
  divisionCount: number;
  dlq: { depth: number; status: string };
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 GB';
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function PanelAgentesPage(): React.JSX.Element {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      sender: 'agent',
      text: '🛰️ **OMNI-SUPERVISOR DE EAR OS (S-CLASS) CONECTADO**\n\nBienvenido a la terminal de mando de agentes. Flota de 32 agentes en guardia.\n\n**Hardware Detectado en Local:**\n• GPU: NVIDIA Quadro M1000M (2 GB VRAM GDDR5)\n• CPU: Intel Core i7-6820HQ (4 Núcleos / 8 Hilos @ 2.70 GHz)\n• RAM: 16 GB DDR4\n• Modelo Asistente Activo: Gemini 1.5 Flash (Cloud / Zero VRAM) + Motor Local Ollama compatible (Qwen 2.5 1.5B / Llama 3.2 1B)\n\n¿Qué orden deseas impartir?',
      time: '08:00',
    },
  ]);
  const [input, setInput] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hardware, setHardware] = React.useState<HardwareInfo | null>(null);
  const [fleet, setFleet] = React.useState<FleetStatus | null>(null);
  const [replaying, setReplaying] = React.useState<boolean>(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    let cancelled = false;
    const loadTelemetry = async (): Promise<void> => {
      try {
        const [hwRes, stRes] = await Promise.all([
          fetch('/api/agents/hardware', { cache: 'no-store' }),
          fetch('/api/agents/status', { cache: 'no-store' }),
        ]);
        if (!cancelled && hwRes.ok) setHardware((await hwRes.json()) as HardwareInfo);
        if (!cancelled && stRes.ok) setFleet((await stRes.json()) as FleetStatus);
      } catch {
        // Telemetría no crítica: el chat sigue operativo aunque falle.
      }
    };
    void loadTelemetry();
    const interval = setInterval(() => void loadTelemetry(), 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const replayDlq = async (): Promise<void> => {
    setReplaying(true);
    try {
      const res = await fetch('/api/agents/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'replay-dlq' }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: res.ok
            ? `🛰️ Replay DLQ completado: ${data.replay?.succeeded ?? 0} entregados, ${data.replay?.failed ?? 0} pendientes de reintento.`
            : '⛔ Replay DLQ no autorizado: se requiere token de administrador (x-agent-token).',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      const stRes = await fetch('/api/agents/status', { cache: 'no-store' });
      if (stRes.ok) setFleet((await stRes.json()) as FleetStatus);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: '❌ Error al ejecutar el replay de DLQ.', time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } finally {
      setReplaying(false);
    }
  };

  const send = async (customText?: string): Promise<void> => {
    const text = customText ?? input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: data.reply || 'Sin respuesta del agente.',
          traces: data.traces,
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: '❌ Error al conectar con el endpoint de agentes.',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecb613] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ecb613]"></span>
              </span>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-white">
                CENTRO DE MANDO // AGENTES EAR OS
              </h1>
            </div>
            <p className="mt-1 font-mono text-xs text-white/50">
              Terminal conversacional interactiva • Flota Titan (32 Agentes) • Invocable vía <kbd className="rounded bg-white/10 px-1 py-0.5 text-white/80">Ctrl+Shift+A</kbd> o <kbd className="rounded bg-white/10 px-1 py-0.5 text-white/80">?agent=true</kbd>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/panel/reservas"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-white/80 hover:bg-white/10"
            >
              ← Volver a Reservas
            </Link>
          </div>
        </div>

        {/* METRICS & HARDWARE BAR (telemetría real del nodo) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-[#09090d] p-4">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">CPU · Nodo</span>
            <div className="mt-1 font-mono text-sm font-bold text-[#ecb613]">
              {hardware ? `${hardware.cpu.physicalCores} Cores / ${hardware.cpu.logicalCores} Hilos` : 'Sondeando…'}
            </div>
            <span className="block truncate font-mono text-xs text-white/60">
              {hardware ? hardware.cpu.model.split('@')[0].trim().slice(0, 40) : '—'}
            </span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#09090d] p-4">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">RAM · Uptime</span>
            <div className="mt-1 font-mono text-sm font-bold text-white">
              {hardware ? `${formatBytes(hardware.memory.totalBytes)} · ${hardware.memory.usedPercent}% usada` : '—'}
            </div>
            <span className="font-mono text-xs text-emerald-400">
              {hardware ? `uptime ${formatUptime(hardware.uptimeSeconds)}` : '—'}
            </span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#09090d] p-4">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Flota de Agentes</span>
            <div className="mt-1 font-mono text-sm font-bold text-cyan-400">
              {fleet ? `${fleet.entryAgentCount} Agentes de Entrada` : '32 Agentes'}
            </div>
            <span className="font-mono text-xs text-white/60">
              {fleet ? `${fleet.divisionCount} Divisiones · Kill-Switch ${fleet.killSwitch ? '⛔ ON' : '✅ OFF'}` : '4 Divisiones de Choque'}
            </span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#09090d] p-4">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Persistencia DLQ</span>
            <div className="mt-1 font-mono text-sm font-bold text-emerald-400">
              {fleet ? `${fleet.dlq.depth} en cola` : '.antigravity/dlq.jsonl'}
            </div>
            <button
              type="button"
              onClick={() => void replayDlq()}
              disabled={replaying || !fleet || fleet.dlq.depth === 0}
              className="mt-1 rounded-md border border-[#ecb613]/40 bg-[#ecb613]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#ecb613] transition-all hover:bg-[#ecb613] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {replaying ? 'Reintentando…' : '↻ Replay DLQ'}
            </button>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div className="flex flex-col h-[580px] rounded-2xl border border-white/10 bg-[#060609] overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-lg ${
                    m.sender === 'user'
                      ? 'rounded-tr-sm bg-gradient-to-r from-[#ecb613] to-[#d4a010] font-sans font-medium text-black'
                      : 'rounded-tl-sm border border-white/10 bg-[#0c0c14] text-white/90'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {m.traces && m.traces.length > 0 && (
                    <div className="mt-3.5 border-t border-white/10 pt-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
                        ⚡ Trazas de Delegación en el Bus:
                      </span>
                      <div className="mt-2 space-y-1.5">
                        {m.traces.map((t, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-2 rounded border border-white/5 bg-black/50 p-2 font-mono text-xs"
                          >
                            <span className="rounded bg-[#ecb613]/20 px-1.5 py-0.5 text-[10px] text-[#ecb613]">
                              {t.to}
                            </span>
                            <span className="text-white/80">{t.reply.summary}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[10px] font-mono ${
                      m.sender === 'user' ? 'text-black/60 text-right' : 'text-white/40'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 font-mono text-xs text-[#ecb613] animate-pulse">
                <span>●</span>
                <span>Omni-Supervisor coordinando a los agentes en el bus...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* QUICK PROMPTS */}
          <div className="flex flex-wrap gap-2 border-t border-white/10 bg-[#09090d] px-6 py-2.5">
            <button
              onClick={() => send('Cotiza un bolo de Edwin Agudelo en Toledo a 120 km terminando a las 3:30 AM para 150 personas')}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white"
            >
              📊 Cotizar bolo 120km Toledo
            </button>
            <button
              onClick={() => send('Calcula el rider acústico de presión sonora para 200 invitados en boda exterior')}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white"
            >
              🔊 Rider acústico 200 pax
            </button>
            <button
              onClick={() => send('Audita si una propuesta de 12.500 € cumple el límite menor B2G de la LCSP')}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white"
            >
              ⚖️ Licitación menor B2G (Art. 118)
            </button>
            <button
              onClick={() => send('Estima el protocolo VIMUME de 4 sesiones a 40 Hz y su deducción en IRPF Ley 49/2002')}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white"
            >
              🧠 VIMUME 40 Hz & Deducción
            </button>
          </div>

          {/* INPUT FORM */}
          <div className="border-t border-white/10 bg-[#0a0a0f] p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta o pide asistencia al Omni-Supervisor (ej. 'cotiza un bolo', 'redacta un contrato')..."
                className="flex-1 rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-sm text-white placeholder-white/40 focus:border-[#ecb613] focus:outline-none focus:ring-1 focus:ring-[#ecb613]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105 disabled:opacity-50"
              >
                <span>ENVIAR</span>
                <span>➔</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
