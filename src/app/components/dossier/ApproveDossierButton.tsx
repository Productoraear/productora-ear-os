/**
 * 🔘 COMPONENT: ApproveDossierButton - CLIENT INTERACTION
 */

"use client";

import React, { useState } from 'react';
import { ShieldCheck, Loader2, Check } from 'lucide-react';
import { approveDossier } from '@/app/actions/dossierActions';

interface Props {
  dossierId: string;
  token?: string;
}

export const ApproveDossierButton: React.FC<Props> = ({ dossierId, token }) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await approveDossier(dossierId, token || '');
      if (result.success) {
        setDone(true);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (e) {
      setError('Fallo de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="w-full md:w-auto h-20 px-12 bg-green-500 text-black rounded-3xl flex items-center justify-center gap-6 font-black uppercase tracking-widest text-xs">
        Propuesta Confirmada <Check size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full md:w-auto">
      <button 
        onClick={handleApprove}
        disabled={loading}
        className="w-full md:w-auto h-20 px-12 bg-black text-white rounded-3xl flex items-center justify-center gap-6 font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : (
          <>Confirmar Selección <ShieldCheck size={24} /></>
        )}
      </button>
      {error && <span className="text-[10px] text-red-900 font-bold uppercase tracking-tighter text-center">{error}</span>}
    </div>
  );
};
