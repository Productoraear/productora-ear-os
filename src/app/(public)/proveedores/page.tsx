import React from 'react';
import { Metadata } from 'next';
import { ProveedorDirectory } from '@/app/components/ProveedorDirectory';
import { SublimeEventMatchmaker } from '@/app/components/SClassScreens/SublimeEventMatchmaker';
import { Sparkles, ShieldCheck, Heart, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Directorio de Proveedores Homologados S-Class | Productora EAR',
  description: 'Encuentra y contrata proveedores certificados para bodas y eventos en toda España: sonido Bose F1, mariachis de gala, iluminación DMX, fincas singulares y catering.',
  keywords: ['proveedores de bodas', 'alquiler de sonido para eventos', 'mariachi de gala', 'fincas para bodas', 'wedding planners espana']
};

export default function ProveedoresIndexPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 font-sans">
      
      {/* HERO SECTION */}
      <section className="relative pt-44 pb-20 px-6 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#ecb613]/10 to-transparent blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" /> RED DE EXCELENCIA NACIONAL
          </div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight max-w-5xl leading-[0.95]">
            Proveedores Homologados <span className="text-[#ecb613] italic">& Matchmaking</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-lg max-w-3xl leading-relaxed font-light">
            El estándar de provisión técnica y artística más estricto de España. Todos los profesionales cuentan con seguro de RC de 1M€, riders acústicos estandarizados y SLA garantizado por contrato.
          </p>
        </div>
      </section>

      {/* TÚNEL NEURAL DE MATCHMAKING EN 10 PANTALLAS */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Sparkles className="text-[#ecb613] w-5 h-5" />
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Túnel Asistido de Selección Automática
          </h2>
        </div>
        <SublimeEventMatchmaker initialLocation="madrid" />
      </section>

      {/* DIRECTORIO Y FILTRADO POR CALIDAD/PRECIO */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <ProveedorDirectory />
      </section>

      {/* CALL TO ACTION PARA PROVEEDORES NO REGISTRADOS */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-transparent to-amber-950/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0d] border border-[#ecb613]/30 p-10 md:p-14 rounded-[3rem]">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ecb613]">
              ¿Eres Proveedor o Artista Profesional?
            </span>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Únete a la Red Homologada de Productora EAR
            </h3>
            <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed">
              Recibe solicitudes de cotización filtradas con aforo, presupuesto cerrado y pago garantizado mediante nuestro Split Soberano (80% directo al proveedor).
            </p>
          </div>

          <Link
            href="/contacto"
            className="px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-[#d4a210] text-black font-mono font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-[#ecb613]/20 flex items-center gap-2 shrink-0"
          >
            Solicitar Homologación <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
}
