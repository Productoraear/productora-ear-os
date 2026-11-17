'use client';

import React, { useEffect, useState, useCallback } from 'react';

export function DevVisualAuditor() {
  const [isActive, setIsActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<{
    text: string;
    selector: string;
    pathname: string;
  } | null>(null);
  const [directive, setDirective] = useState('');
  const [sending, setSending] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo: Ctrl + Shift + R
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInspectClick = useCallback(
    (e: MouseEvent) => {
      if (!isActive) return;
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (!target) return;

      // Ignorar clics dentro del propio panel de auditoría
      if (target.closest('[data-dev-auditor="true"]')) return;

      const selection = window.getSelection()?.toString().trim();
      const textContent =
        selection || target.innerText || target.getAttribute('alt') || target.getAttribute('aria-label') || '';

      // Generar selector CSS identificativo
      const tag = target.tagName.toLowerCase();
      const idStr = target.id ? `#${target.id}` : '';
      const classStr = target.className && typeof target.className === 'string'
        ? `.${target.className.trim().split(/\s+/).slice(0, 2).join('.')}`
        : '';
      const selector = `${tag}${idStr}${classStr}`;

      setSelectedData({
        text: textContent,
        selector,
        pathname: window.location.pathname,
      });

      setDialogOpen(true);
      setIsActive(false);
    },
    [isActive]
  );

  useEffect(() => {
    if (isActive) {
      document.body.style.cursor = 'crosshair';
      document.addEventListener('click', handleInspectClick, true);
    } else {
      document.body.style.cursor = 'default';
      document.removeEventListener('click', handleInspectClick, true);
    }
    return () => {
      document.body.style.cursor = 'default';
      document.removeEventListener('click', handleInspectClick, true);
    };
  }, [isActive, handleInspectClick]);

  const handleSubmit = async () => {
    if (!selectedData || !directive.trim()) return;
    setSending(true);

    try {
      const res = await fetch('/api/dev/audit-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedData,
          directive: directive.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setDialogOpen(false);
        setDirective('');
        setSuccessToast(true);
        setTimeout(() => setSuccessToast(false), 3000);
      }
    } catch (err) {
      console.error('[DevVisualAuditor] Error registrando auditoría:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-dev-auditor="true">
      {/* Botón flotante indicador (solo visible en escritorio para no solapar con el dock móvil) */}
      <div className="fixed bottom-4 left-4 z-[99999] hidden lg:flex items-center gap-2 select-none">
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-full shadow-2xl transition-all flex items-center gap-1.5 ${
            isActive
              ? 'bg-amber-400 text-black ring-4 ring-amber-300/80 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
              : 'bg-zinc-950/95 text-zinc-300 border border-amber-500/40 hover:border-amber-400 hover:text-white backdrop-blur-md'
          }`}
          title="Activar Inspector de Auditoría Visual (Ctrl + Shift + R)"
        >
          <span>{isActive ? '🎯 CLIC EN ELEMENTO' : '🛠️ AUDITORÍA'}</span>
          <span className="text-[10px] opacity-70 bg-black/40 px-1 py-0.5 rounded">Ctrl+Shift+R</span>
        </button>

        {successToast && (
          <span className="text-xs bg-emerald-500 text-black font-mono font-bold px-2.5 py-1 rounded-full shadow-lg animate-in fade-in">
            ✓ Ticket Registrado en scratch
          </span>
        )}
      </div>

      {/* Modal de Directiva de Cambio */}
      {dialogOpen && selectedData && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-in fade-in duration-150">
          <div className="bg-[#0c0c12] border border-amber-500/50 rounded-2xl p-6 max-w-lg w-full shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase font-mono flex items-center gap-2">
                <span>🛠️ Inspector Visual · Especificación de Cambio</span>
              </h3>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="bg-black/80 p-3 rounded-xl border border-zinc-800/80 text-xs font-mono text-zinc-300 space-y-1.5">
              <p>
                <span className="text-zinc-500">Ruta:</span> <span className="text-amber-300">{selectedData.pathname}</span>
              </p>
              <p>
                <span className="text-zinc-500">Elemento:</span> <span className="text-sky-300">{selectedData.selector}</span>
              </p>
              <p className="line-clamp-2">
                <span className="text-zinc-500">Texto detectado:</span>{' '}
                <span className="text-zinc-200 italic">&ldquo;{selectedData.text}&rdquo;</span>
              </p>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-medium">
                ¿Qué corrección o directiva deseas aplicar a este elemento?
              </label>
              <textarea
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                rows={4}
                autoFocus
                placeholder="Ejemplo: Corregir precio a 100 € según Menú Cantábrico 2026, cambiar copy o alinear elemento..."
                className="w-full bg-black/90 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={sending || !directive.trim()}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
              >
                {sending ? 'Registrando...' : 'Disparar Corrección'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
