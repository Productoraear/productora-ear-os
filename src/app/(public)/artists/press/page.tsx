import React from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { FileText, Download, ShieldCheck, Mail } from 'lucide-react';

export default function PublicPressPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Press Room
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Official PR Kits
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Prensa & Medios
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto italic">
            Recursos oficiales, dossiers de prensa, biografías autorizadas y material fotográfico en alta resolución para promotores y periodistas.
          </p>
        </div>

        {/* Kits */}
        <div className="space-y-6">
          {SEED_ARTISTS.map((artist) => (
            <div key={artist.id} className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/10 transition-colors">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white font-syne">{artist.displayName}</h3>
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-mono">
                  {artist.role} · Kit de Prensa v2026
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 bg-white/5 border border-white/5 text-white hover:bg-white hover:text-black px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  Dossier Completo <FileText size={14} />
                </button>
                <button className="bg-[#ecb613] text-black hover:bg-white px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center">
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 blur-3xl rounded-full" />
          <ShieldCheck size={36} className="text-[#ecb613] mx-auto" />
          <h3 className="text-2xl font-black uppercase tracking-tight font-syne">¿Necesitas una Entrevista o Acreditación?</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
            Ponte en contacto con nuestro departamento de prensa para coordinar agendas, solicitar pases de prensa o material exclusivo adicional.
          </p>
          <a href="mailto:press@productoraear.com" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ecb613] transition-colors">
            Contactar Prensa <Mail size={14} />
          </a>
        </div>

      </div>
    </main>
  );
}
