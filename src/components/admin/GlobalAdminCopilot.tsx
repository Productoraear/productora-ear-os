'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ChevronRight, Zap, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function GlobalAdminCopilot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [contextMessage, setContextMessage] = useState('Analizando contexto operativo del sistema...');
  const [quickOptions, setQuickOptions] = useState<string[]>([]);
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Evaluador heurístico según la ruta actual del Admin
  const evaluateContext = (path: string) => {
    if (path.includes('/admin/sourcing')) {
      setContextMessage('Módulo Sourcing activo. Detecto control de tesorería y pipeline de proveedores homologados.');
      setQuickOptions([
        'Cargar partidas estándar para boda de 120 pax (Finca + Catering + Rider)',
        'Revisar clientes con aniversario inminente (Copiloto Outreach LTV)',
        'Verificar el checklist de puertas de producción en campo'
      ]);
    } else if (path.includes('/admin/directorio')) {
      setContextMessage('Cabina de Directorio Homologado S-Class activa.');
      setQuickOptions([
        'Auditar proveedores con póliza de seguro RC próxima a caducar',
        'Vampirizar y migrar nuevos registros desde bases de datos externas',
        'Exportar catálogo homologado en formato CSV para la finca'
      ]);
    } else {
      setContextMessage('Centro de mando EAR OS en modo soberano.');
      setQuickOptions([
        'Calcular margen neto proyectado para evento corporativo B2G',
        'Sincronizar base de datos Supabase con archivos locales de respaldo',
        'Redactar cláusula de potencia eléctrica para contrato de rider'
      ]);
    }
  };

  // Control robusto de inactividad (5 segundos exactos)
  useEffect(() => {
    evaluateContext(pathname);

    const triggerIdle = () => {
      setIsOpen(true);
    };

    const resetIdleTimer = () => {
      // Opcional: si prefieres que se cierre al mover el ratón, descomenta la siguiente línea:
      // setIsOpen(false);
      
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(triggerIdle, 5000); // 5 segundos
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    // Iniciar temporizador inicial
    idleTimerRef.current = setTimeout(triggerIdle, 5000);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [pathname]);

  const handleOptionClick = (option: string) => {
    alert(`[EAR OS Copiloto]: Ejecutando acción -> "${option}"`);
    setIsOpen(false);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE PERMANENTE DE ACCESO RÁPIDO */}
      <button
        onClick={() => {
          evaluateContext(pathname);
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-amber-400 text-neutral-950 hover:bg-amber-300 font-mono font-bold text-xs shadow-2xl shadow-amber-400/30 transition-all cursor-pointer border border-amber-300"
        title="Copiloto Global EAR OS"
      >
        <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
        <span>Copiloto IA</span>
      </button>

      {/* VENTANA FLOTANTE DEL COPILOTO */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/40 shadow-2xl shadow-amber-500/10 text-neutral-100 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 block">COPILOTO GLOBAL EAR OS</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Asistencia Reactiva (Contexto Automático)</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-200 font-sans leading-relaxed bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
              {contextMessage}
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Opciones recomendadas:</span>
              {quickOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  className="w-full text-left flex items-center justify-between gap-2 p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-400/50 text-xs font-mono text-neutral-200 hover:text-white transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                    {opt}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
