'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, X, ChevronRight, Zap, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';

const IDLE_TIMEOUT_MS = 5000;

export default function GlobalAdminCopilot(): React.JSX.Element {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contextMessage, setContextMessage] = useState<string>(
    'Analizando contexto operativo del sistema...'
  );
  const [quickOptions, setQuickOptions] = useState<string[]>([]);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const evaluateContext = useCallback((path: string): void => {
    if (path.includes('/admin/sourcing')) {
      setContextMessage(
        'Módulo Sourcing activo. Detecto control de tesorería y pipeline de proveedores homologados.'
      );
      setQuickOptions([
        'Cargar partidas estándar para boda de 120 pax (Finca + Catering + Rider)',
        'Revisar clientes con aniversario inminente (Copiloto Outreach LTV)',
        'Verificar el checklist de puertas de producción en campo',
      ]);
    } else if (path.includes('/admin/directorio')) {
      setContextMessage('Cabina de Directorio Homologado S-Class activa.');
      setQuickOptions([
        'Auditar proveedores con póliza de seguro RC próxima a caducar',
        'Vampirizar y migrar nuevos registros desde bases de datos externas',
        'Exportar catálogo homologado en formato CSV para la finca',
      ]);
    } else {
      setContextMessage('Centro de mando EAR OS en modo soberano.');
      setQuickOptions([
        'Calcular margen neto proyectado para evento corporativo B2G',
        'Sincronizar base de datos Supabase con archivos locales de respaldo',
        'Redactar cláusula de potencia eléctrica para contrato de rider',
      ]);
    }
  }, []);

  useEffect(() => {
    evaluateContext(pathname);

    const triggerIdle = (): void => {
      setIsOpen(true);
    };

    const resetIdleTimer = (): void => {
      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(triggerIdle, IDLE_TIMEOUT_MS);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    idleTimerRef.current = setTimeout(triggerIdle, IDLE_TIMEOUT_MS);

    return () => {
      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [pathname, evaluateContext]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        if (toggleButtonRef.current !== null) {
          toggleButtonRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleOptionClick = useCallback((option: string): void => {
    if (typeof window !== 'undefined') {
      window.alert(`[EAR OS Copiloto]: Ejecutando acción -> "${option}"`);
    }
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback((): void => {
    evaluateContext(pathname);
    setIsOpen((prev) => !prev);
  }, [evaluateContext, pathname]);

  const handleClose = useCallback((): void => {
    setIsOpen(false);
    if (toggleButtonRef.current !== null) {
      toggleButtonRef.current.focus();
    }
  }, []);

  return (
    <>
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[#ecb613] text-neutral-950 hover:bg-amber-300 font-mono font-bold text-xs shadow-2xl shadow-amber-400/30 transition-all cursor-pointer border border-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
        title="Copiloto Global EAR OS"
        aria-expanded={isOpen}
        aria-controls="global-admin-copilot-panel"
        aria-haspopup="dialog"
        aria-label={isOpen ? 'Cerrar Copiloto Global EAR OS' : 'Abrir Copiloto Global EAR OS'}
      >
        <Sparkles
          className="w-4 h-4 animate-spin"
          style={{ animationDuration: '4s' }}
          aria-hidden="true"
          focusable="false"
        />
        <span>Copiloto IA</span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="global-admin-copilot-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Copiloto Global EAR OS"
          aria-labelledby="global-admin-copilot-title"
          aria-describedby="global-admin-copilot-context"
          className="fixed bottom-24 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/40 shadow-2xl shadow-amber-500/10 text-neutral-100 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl bg-[#ecb613] text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20"
                  aria-hidden="true"
                >
                  <Bot className="w-4 h-4" aria-hidden="true" focusable="false" />
                </div>
                <div>
                  <span
                    id="global-admin-copilot-title"
                    className="text-xs font-mono font-bold text-amber-400 block"
                  >
                    COPILOTO GLOBAL EAR OS
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Asistencia Reactiva (Contexto Automático)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                aria-label="Cerrar Copiloto Global"
              >
                <X className="w-4 h-4" aria-hidden="true" focusable="false" />
              </button>
            </div>

            <p
              id="global-admin-copilot-context"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="text-xs text-neutral-200 font-sans leading-relaxed bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80"
            >
              {contextMessage}
            </p>

            <div className="space-y-1.5 pt-1">
              <span
                id="global-admin-copilot-options-label"
                className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block"
              >
                Opciones recomendadas:
              </span>
              <div
                role="group"
                aria-labelledby="global-admin-copilot-options-label"
                className="space-y-1.5"
              >
                {quickOptions.map((opt, idx) => (
                  <button
                    type="button"
                    key={`${idx}-${opt}`}
                    onClick={() => handleOptionClick(opt)}
                    aria-label={`Ejecutar acción recomendada: ${opt}`}
                    className="w-full text-left flex items-center justify-between gap-2 p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-400/50 text-xs font-mono text-neutral-200 hover:text-white transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                  >
                    <span className="flex items-center gap-2">
                      <Zap
                        className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                        focusable="false"
                      />
                      {opt}
                    </span>
                    <ChevronRight
                      className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform shrink-0"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}