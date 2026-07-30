import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ShieldCheck, Zap, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
export const metadata = {
    title: 'Reserva Inmediata | Talent OS',
    description: 'Bloqueo de fecha y reserva de talento mediante el gatillo de 1€.',
};
export default async function ArtistBookingPage({ params }) {
    let artist;
    try {
        artist = await prisma.artistProfile.findUnique({
            where: { slug: params.slug },
        });
    }
    catch (error) {
        console.error("❌ [TALENT OS] Error al cargar datos para reserva:", error);
        notFound();
    }
    if (!artist || artist.status !== 'PUBLISHED') {
        notFound();
    }
    return (<main className="min-h-screen bg-[#050505] text-white pt-40 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* 🛡️ SECCIÓN DE RESERVA */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 md:p-20 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/10 blur-[100px] rounded-full pointer-events-none"/>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-lg text-[#ecb613]">
                 <Zap size={20}/>
               </div>
               <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">Reserva Instantánea</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none font-syne">
              Bloquear Fecha <br /><span className="text-white/40">{artist.displayName}</span>
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
             <div className="space-y-8">
                <p className="text-white/60 leading-relaxed italic">
                  "El gatillo de 1€ garantiza la exclusividad de la fecha durante las próximas 48 horas mientras nuestro equipo valida la viabilidad logística."
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/40">
                    <Calendar size={18}/> <span className="text-[10px] font-black uppercase tracking-widest">Sincronizado con Studio</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/40">
                    <ShieldCheck size={18}/> <span className="text-[10px] font-black uppercase tracking-widest">Garantía EAR Gold</span>
                  </div>
                </div>
             </div>

             <div className="bg-white/5 p-10 rounded-3xl space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Depósito de Reserva</span>
                  <span className="text-3xl font-black italic">1,00 €</span>
                </div>
                <button className="w-full bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] py-5 rounded-xl flex items-center justify-center gap-4 hover:bg-white transition-all">
                  Proceder al Pago <CreditCard size={18}/>
                </button>
                <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold text-center leading-relaxed">
                  Pago seguro procesado por EAR Payments. <br />No reembolsable tras validación de fecha.
                </p>
             </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href={`/artistas/${artist.slug}`} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
            ← Volver al Perfil
          </Link>
        </div>
      </div>
    </main>);
}
