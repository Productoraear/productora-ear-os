/**
 * 📄 DOSSIER LANDING - S-CLASS PROPOSAL VIEW
 * Purpose: Render a personalized proposal with conversion triggers.
 */
import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Zap, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { ApproveDossierButton } from '@/app/components/dossier/ApproveDossierButton';
export async function generateMetadata({ params }) {
    return {
        title: `Propuesta EAR GOLD | Dossier S-Class`,
        robots: 'noindex, nofollow', // Propuesta privada
    };
}
export default async function DossierPage({ params, searchParams }) {
    const supabase = createClient();
    // 🔐 FETCH SECURE (ID + Token validation could be added here)
    const { data: dossier, error } = await supabase
        .from('dossier_proposals')
        .select('*')
        .eq('id', params.id)
        .single();
    if (error || !dossier)
        notFound();
    // ⏰ EXPIRATION CHECK
    const isExpired = new Date(dossier.expires_at) < new Date();
    if (isExpired) {
        return (<div className="min-h-screen bg-black flex items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase text-white/20 mb-4">Propuesta Expirada</h1>
          <p className="text-white/40 uppercase text-[10px] font-bold tracking-widest">Contacta con soporte para renovar tu dossier.</p>
        </div>
      </div>);
    }
    return (<main className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="container-custom max-w-4xl">
        {/* HEADER */}
        <header className="mb-20 border-b border-white/5 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="px-4 py-1 bg-[#d4a855]/10 text-[#d4a855] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#d4a855]/20">
              {dossier.channel} SECTOR
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Exp: {new Date(dossier.expires_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight mb-10">
            Dossier Técnico <br />
            <span className="text-white/20">Preparado para {dossier.contact_name}</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                <Calendar className="text-[#d4a855]" size={20}/>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-white/30 block">Ocasión</span>
                <span className="text-sm font-bold uppercase">{dossier.occasion_slug}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                <MapPin className="text-[#d4a855]" size={20}/>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-white/30 block">Territorio</span>
                <span className="text-sm font-bold uppercase">{dossier.province || 'Nacional'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ASSET LIST */}
        <section className="mb-24">
          <h2 className="text-2xl font-black uppercase italic tracking-widest mb-12 flex items-center gap-4">
            <Zap className="text-[#d4a855]"/> Configuración <span className="text-white/20">Seleccionada</span>
          </h2>
          <div className="space-y-6">
            {dossier.selected_assets.map((assetId, i) => (<div key={i} className="group p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-black text-white/10 italic">0{i + 1}</span>
                  <span className="text-lg font-bold uppercase tracking-tight">{assetId.replace(/-/g, ' ')}</span>
                </div>
                <CheckCircle className="text-[#d4a855]/40 group-hover:text-[#d4a855] transition-colors"/>
              </div>))}
          </div>
        </section>

        {/* ACTIONS */}
        <footer className="p-12 bg-[#d4a855] rounded-[3rem] text-black">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-md">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">Aprobar Propuesta Preliminar</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                Al confirmar, un analista S-Class validará la disponibilidad final y activará el protocolo de reserva.
              </p>
            </div>
            
            {/* ⚡ SERVER ACTION CALL */}
            <ApproveDossierButton dossierId={dossier.id} token={searchParams.token}/>
          </div>
        </footer>
      </div>
    </main>);
}
