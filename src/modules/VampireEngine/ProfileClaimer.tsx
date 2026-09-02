"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function ProfileClaimer() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [companyName, setCompanyName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{name: string, rating: number, reviews: number } | null>(null);

  // MOCK: Search results based on the input
  const searchResults = [
    { name: companyName || "Tu Empresa Bodas", rating: 4.8, reviews: 142 },
    { name: (companyName || "Tu Empresa") + " Eventos", rating: 4.2, reviews: 34 }
  ];

  const handleSelect = (company: any) => {
    setSelectedCompany(company);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* GLOWS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="absolute top-8 left-8">
        <Icons.Shield className="w-8 h-8 text-[#d4af37]" />
      </header>

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: LOCATE THE VAMPIRIZED PROFILE */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight">Encuentra Tu Empresa</h1>
                <p className="text-zinc-400">Nuestro algoritmo S-Class ha indexado a miles de proveedores. Reclama tu perfil para activar tus métricas y rankear por encima tus competidores.</p>
              </div>

              <div className="relative">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#d4af37] text-xl transition-all font-mono"
                  placeholder="Ej: Finca Los Ángeles, DJ..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {companyName.length > 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <p className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">Perfiles Indexados (Vampire Engine)</p>
                  
                  {searchResults.map((company, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelect(company)}
                      className="bg-black border border-white/5 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#d4af37] hover:bg-zinc-900 transition-all group"
                    >
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-[#d4af37] transition-colors">{company.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <Icons.Star className="w-3 h-3 text-[#d4af37]" /> {company.rating} ({company.reviews} opiniones importadas)
                        </div>
                      </div>
                      <button className="bg-white text-black px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Soy el Propietario
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 2: PROFILE BLOCKED / UP-SELL */}
          {step === 2 && selectedCompany && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-red-500/20 p-8 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                <Icons.Lock className="w-8 h-8 text-red-500" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-red-500 mb-2">Perfil Congelado</h2>
                <h3 className="text-xl text-white font-medium">{selectedCompany.name}</h3>
                <p className="text-zinc-400 text-sm mt-4">
                  Tu perfil está indexado en EAR OS pero actualmente <strong>no estás recibiendo leads directos</strong>. Estás perdiendo clientes frente a los proveedores verificados.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                <div className="text-left">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Leads Perdidos (30D)</p>
                  <p className="text-2xl font-mono text-white font-black">14</p>
                </div>
                <div className="text-left border-l border-white/5 pl-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Posición Roster</p>
                  <p className="text-2xl font-mono text-white font-black">#89</p>
                </div>
              </div>

              <button 
                onClick={() => setStep(3)}
                className="w-full bg-[#d4af37] text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Icons.Key className="w-5 h-5" /> Desbloquear Perfil S-Class
              </button>
            </motion.div>
          )}

          {/* STEP 3: MOCK CHECKOUT */}
          {step === 3 && selectedCompany && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
               <h2 className="text-3xl font-black font-display text-center mb-8">Activación Inmediata</h2>
               
               <div className="bg-black border border-[#d4af37]/30 rounded-2xl p-6 flex items-start gap-4">
                  <Icons.CheckCircle className="w-6 h-6 text-[#d4af37] shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">Membresía S-Class Provider</h4>
                    <p className="text-zinc-400 text-sm mb-4">Top 3 en resultados, leads ilimitados sin comisiones absurdas y panel analítico completo.</p>
                    <div className="text-2xl font-mono font-black text-[#d4af37]">49€ <span className="text-xs text-zinc-500 font-sans">/mes</span></div>
                  </div>
               </div>

               <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-4">
                 <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Información de Pago (Mock)</p>
                 <input type="text" placeholder="Número de Tarjeta" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#d4af37] outline-none" disabled />
                 <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="MM/YY" className="bg-black border border-white/10 rounded-lg p-3 text-sm" disabled />
                   <input type="text" placeholder="CVC" className="bg-black border border-white/10 rounded-lg p-3 text-sm" disabled />
                 </div>
                 
                 <button className="w-full mt-4 bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all">
                  Pagar y Reclamar
                 </button>
                 <p className="text-center text-[10px] text-zinc-600 font-mono pt-2">Powered By EAR OS RAG SYSTEM</p>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
