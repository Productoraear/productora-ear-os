"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Bot,
  Clock,
  AlertTriangle,
  Heart,
  Gift,
  Music,
} from "lucide-react";
import { generateOutreachLTV } from "../actions/server-actions";

interface LeadEntry {
  coupleName: string;
  weddingDate: string;
  eventDetails: string;
}

const SUGGESTED_LEADS: LeadEntry[] = [
  {
    coupleName: "Sergio y Adriana",
    weddingDate: "15 de junio de 2025",
    eventDetails: "Boda en finca con 120 invitados, actuación en directo de tenor, iluminación cénica, catering de autor",
  },
  {
    coupleName: "Eduardo y Lion Wong",
    weddingDate: "20 de septiembre de 2025",
    eventDetails: "Boda urbana en Madrid, 80 invitados, DJ + saxofonista en directo, cóctel de bienvenida",
  },
  {
    coupleName: "Yanet y Cecilia",
    weddingDate: "10 de mayo de 2025",
    eventDetails: "Boda íntima en jardín, 40 invitados, cuarteto de cuerda, brunch posterior",
  },
];

export default function LeadOutreachCopilot() {
  const [coupleName, setCoupleName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!coupleName.trim() || !weddingDate.trim()) {
      setError("Nombre de la pareja y fecha de boda son obligatorios.");
      return;
    }
    setGenerating(true);
    setError(null);
    setResult(null);

    const res = await generateOutreachLTV(coupleName, weddingDate, eventDetails || "Boda estándar");

    if (res.success && res.data) {
      setResult(res.data.message);
      setLatency(res.data.latency_ms);
      setModel(res.data.model);
    } else {
      setError(res.error ?? "Error al generar el mensaje. Verifica que Ollama está activo.");
    }
    setGenerating(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silencioso
    }
  };

  const loadSuggested = (lead: LeadEntry) => {
    setCoupleName(lead.coupleName);
    setWeddingDate(lead.weddingDate);
    setEventDetails(lead.eventDetails);
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 to-neutral-900 border border-amber-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">COPILOTO OUTREACH LTV — CAC = 0 €</h3>
            <p className="text-xs text-neutral-400 font-mono">
              Genera mensajes de aniversario personalizados con IA local (Ollama). Sin coste publicitario.
            </p>
          </div>
        </div>
      </div>

      {/* ── LEADS SUGERIDOS ── */}
      <div>
        <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3">
          Leads Históricos (Bodas.net)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SUGGESTED_LEADS.map((lead, idx) => (
            <button
              key={idx}
              onClick={() => loadSuggested(lead)}
              className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {lead.coupleName}
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400">{lead.weddingDate}</p>
              <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{lead.eventDetails}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── FORMULARIO ── */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-neutral-400 block mb-1">Nombre de la Pareja</label>
            <input
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
              placeholder="Ej: Sergio y Adriana"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-neutral-400 block mb-1">Fecha de la Boda</label>
            <input
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              placeholder="Ej: 15 de junio de 2025"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-neutral-400 block mb-1">Detalles del Evento</label>
            <textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="Ej: Boda en finca con 120 invitados, actuación en directo de tenor, iluminación cénica..."
              rows={3}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none resize-none"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm font-mono font-bold transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto"
        >
          {generating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" /> Generando con IA local...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Generar Mensaje de Aniversario
            </>
          )}
        </button>
      </div>

      {/* ── RESULTADO ── */}
      {result && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-emerald-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400 font-bold">MENSAJE GENERADO</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500">
              {latency !== null && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {latency}ms
                </span>
              )}
              {model && <span>{model}</span>}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <p className="text-sm text-neutral-200 font-sans leading-relaxed whitespace-pre-wrap">
              {result}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono text-neutral-200 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar al Portapapeles
                </>
              )}
            </button>
            <a
              href={`mailto:?subject=Aniversario%20${encodeURIComponent(coupleName)}&body=${encodeURIComponent(result)}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Enviar por Email
            </a>
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">{error}</p>
            <p className="text-xs text-red-400/70">
              Asegúrate de que Ollama está ejecutándose en http://127.0.0.1:11434 con el modelo configurado.
            </p>
          </div>
        </div>
      )}

      {/* ── INFO LTV ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-neutral-400">ESTRATEGIA</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Aniversarios 1º, 3º y 5º con oferta exclusiva de actuación en directo o sesión de fotos.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-neutral-400">DIFERENCIADOR</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Bodas.net descarta a la pareja post-boda. EAR OS la monetiza durante años con CAC = 0 €.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-neutral-400">IA LOCAL</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Inferencia en RX 7900 XTX. Cero tokens de API externa. Cero coste marginal por mensaje.
          </p>
        </div>
      </div>
    </div>
  );
}