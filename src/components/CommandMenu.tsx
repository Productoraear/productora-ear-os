"use client";
import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Shield, Brain, Target, Users, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-[640px] bg-[#0a0c10] border border-[#d4af37]/30 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden"
          >
            <Command className="flex flex-col">
              <div className="flex items-center border-b border-white/5 px-4">
                <Search className="w-5 h-5 text-[#d4af37]/50" />
                <Command.Input 
                  autoFocus
                  placeholder="Ejecutar protocolo S-Class..."
                  className="w-full bg-transparent py-4 px-3 text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>
              
              <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-none">
                <Command.Empty className="py-6 text-center text-sm text-zinc-500">No se encontraron protocolos.</Command.Empty>
                
                <Command.Group heading="Sistemas Core" className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]/40 px-3 py-2">
                  <Command.Item onSelect={() => runCommand(() => router.push("/command-center"))} className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-[#d4af37] cursor-pointer transition-all group">
                    <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Abrir Centro de Mando (NASA)</span>
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/artists"))} className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-[#d4af37] cursor-pointer transition-all group">
                    <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Invocación Neural Astra</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Misiones Tácticas" className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]/40 px-3 py-2 mt-4">
                  <Command.Item onSelect={() => runCommand(() => router.push("/toolkit-hub"))} className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-[#d4af37] cursor-pointer transition-all group">
                    <Zap className="w-4 h-4" />
                    <span>Desplegar Arsenal de 70 Módulos</span>
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/the-signal"))} className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-300 hover:bg-white/5 hover:text-[#d4af37] cursor-pointer transition-all group">
                    <Target className="w-4 h-4" />
                    <span>Activar Radar The Signal</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
              
              <div className="bg-black/40 px-4 py-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 font-mono">EAR OS v2.0.26</span>
                <div className="flex gap-2">
                  <kbd className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd>
                  <span className="text-[10px] text-zinc-600">Cerrar</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};