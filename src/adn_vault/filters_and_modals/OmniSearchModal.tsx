// src/app/components/ui/OmniSearchModal.tsx
"use client";

import React, { useState, useEffect } from 'react';

export default function OmniSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Listener global para atajo de teclado (Ctrl+K o Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.response);
      } else {
        setResult("⚠️ No se pudo recuperar inteligencia de la Bóveda en este momento.");
      }
    } catch (err) {
      console.error("[OMNISEARCH ERROR]", err);
      setResult("❌ Error de comunicación con el Oráculo Soberano.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md px-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-[#ecb613]/30 rounded-2xl shadow-2xl p-6 text-white relative">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#ecb613] animate-ping"></span>
            <span className="text-sm font-semibold tracking-wider uppercase text-zinc-300">EAR Neural Oracles (OmniSearch)</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white text-sm px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-all"
          >
            ESC
          </button>
        </div>

        {/* Formulario de Consulta */}
        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pregúntale al Genoma EAR (ej. Bodas en Toledo, Musicoterapia VIMUME)..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 px-4 py-1.5 bg-[#ecb613] text-black font-semibold text-xs rounded-lg hover:bg-[#d4a210] transition-all disabled:opacity-50"
            >
              {loading ? "Analizando..." : "Consultar"}
            </button>
          </div>
        </form>

        {/* Resultados de Inteligencia RAG */}
        <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
          {loading && (
            <div className="text-center py-6 text-zinc-400 text-xs animate-pulse">
              Extrayendo contexto gravitacional de la Bóveda física...
            </div>
          )}

          {result && !loading && (
            <div className="p-4 bg-zinc-900/80 border border-[#ecb613]/20 rounded-xl text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap font-mono">
              {result}
            </div>
          )}

          {!result && !loading && (
            <div className="text-center py-6 text-zinc-500 text-xs">
              Escribe una consulta y presiona enter para activar la inferencia soberana.
            </div>
          )}
        </div>

        {/* Pie de Modal */}
        <div className="mt-6 pt-3 border-t border-zinc-800/80 flex justify-between items-center text-[10px] text-zinc-500">
          <span>Motor RAG: GravitationalIngestionEngine v2.0</span>
          <span>Costo de Inferencia: $0.00 (Soberano local)</span>
        </div>

      </div>
    </div>
  );
}