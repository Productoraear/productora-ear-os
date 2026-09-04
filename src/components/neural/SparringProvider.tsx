'use client';
import { createContext, useState, useEffect } from 'react';

export const SparringContext = createContext<any>(null);

export function SparringProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  
  const triggerSparring = () => {
    setIsActive(true);
    setTimeLeft(10);
  };

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setTimeout(() => setIsActive(false), 2000); 
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  return (
    <SparringContext.Provider value={{ triggerSparring }}>
      {children}
      {isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="bg-neutral-950 border border-red-500/50 p-10 rounded-2xl max-w-2xl w-full relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div 
              className="absolute top-0 left-0 h-1 bg-red-500 transition-all duration-1000" 
              style={{ width: `${(timeLeft / 10) * 100}%` }} 
            />
            <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4 animate-pulse">
              [ ALERTA TÁCTICA: INTERVENCIÓN MUNICIPAL ]
            </h2>
            <p className="text-3xl text-white font-light leading-tight mb-8">
              "El concejal exige rebajar los 14.990 € alegando que otra orquesta trae su propio sonido por la mitad."
            </p>
            <textarea 
              autoFocus
              className="w-full bg-black border border-neutral-800 rounded-lg p-4 text-amber-500 focus:border-amber-500 outline-none text-lg resize-none"
              rows={3}
              placeholder="Aplica el Takeaway. Defiende el rider Bose F1. El tiempo corre..."
            />
            <div className="mt-6 flex justify-between items-center">
              <span className="text-4xl font-mono font-bold text-red-500">{timeLeft}s</span>
              <button 
                onClick={() => setIsActive(false)}
                className="bg-amber-500 text-black px-8 py-3 rounded-md font-bold uppercase hover:bg-amber-400"
              >
                Ejecutar Cierre
              </button>
            </div>
          </div>
        </div>
      )}
    </SparringContext.Provider>
  );
}
