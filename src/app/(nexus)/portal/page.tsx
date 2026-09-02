'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SovereignPortal() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulación de Supabase Magic Link
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-[#d4a855]/30">
      {/* AURA ONYX BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#d4a855]/10 to-transparent blur-[150px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 rounded-[3rem] border border-white/5 backdrop-blur-3xl"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-[#d4a855]">
              <Shield size={32} />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black uppercase tracking-widest mb-2">Portal de Soberanía</h1>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Acceso Restringido S-Class</p>
          </div>

          {!sent ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">ID de Comandante (Email)</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="edwin@productoraear.com"
                    required
                    className="w-full bg-black/50 border border-white/10 px-5 py-4 rounded-xl text-sm focus:border-[#d4a855] focus:outline-none transition-colors"
                  />
                  <Database size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-3 hover:bg-[#d4a855] transition-all"
              >
                {loading ? 'Autenticando...' : (
                  <>Autenticar <LogIn size={14} /></>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
              <Lock className="text-green-500 mx-auto mb-4" size={24} />
              <h3 className="text-sm font-black uppercase tracking-widest text-green-500 mb-2">Magic Link Enviado</h3>
              <p className="text-[10px] text-white/60 font-bold uppercase">Verifique la bandeja de entrada de su ID de Comandante para acceder al panel de control.</p>
            </div>
          )}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
            Capa 1: Base de Datos Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
