import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { 
  Star, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Share2, 
  Download, 
  ArrowRight,
  Music,
  Youtube,
  Instagram,
  Mic2,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- 🛠️ CONFIGURACIÓN ISR ---
export const revalidate = 3600; // 1 hora de caché estática

interface ArtistProfilePageProps {
  params: {
    slug: string;
  };
}

/**
 * 🎨 PUBLIC ARTIST PROFILE (AURA ONYX)
 * Vertical: Talent OS
 * Engine: ISR (Incremental Static Regeneration)
 */

export async function generateMetadata({ params }: ArtistProfilePageProps): Promise<Metadata> {
  try {
    const artist = await prisma.artistProfile.findUnique({
      where: { slug: params.slug },
      include: { user: true }
    });

    if (!artist || artist.status !== 'PUBLISHED') {
      return { title: 'Artista no encontrado' };
    }

    return {
      title: `${artist.displayName} | Artista Productora EAR`,
      description: artist.bio || `Perfil oficial de ${artist.displayName} en el ecosistema EAR OS.`,
      alternates: {
        canonical: `https://productoraear.com/artistas/${params.slug}`
      }
    };
  } catch (error) {
    return { title: 'Talent Discovery' };
  }
}

export async function generateStaticParams() {
  try {
    const artists = await prisma.artistProfile.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true }
    });

    return artists.map((artist) => ({
      slug: artist.slug,
    }));
  } catch (error) {
    console.warn("⚠️ [TALENT OS] generateStaticParams falló (posible falta de DB). Devolviendo array vacío para el build.");
    return [];
  }
}

export default async function ArtistProfilePage({ params }: ArtistProfilePageProps) {
  let artist;
  try {
    artist = await prisma.artistProfile.findUnique({
      where: { slug: params.slug },
      include: {
        riders: { orderBy: { version: 'desc' }, take: 1 },
        calendar: true
      }
    });
  } catch (error) {
    console.error("❌ [TALENT OS] Error al cargar datos del artista:", error);
    notFound();
  }

  if (!artist || artist.status !== 'PUBLISHED') {
    notFound();
  }

  // --- 🧬 SCHEMA.ORG (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": artist.displayName,
    "description": artist.bio,
    "url": `https://productoraear.com/artistas/${artist.slug}`,
    "genre": artist.genres,
    "image": artist.mediaKitUrl
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🚀 HERO SECTION: IDENTITY & AURA */}
      <section className="relative h-screen flex items-end pb-24 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[200px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-4 py-1 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-full text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">
                 Perfil Auditado
               </div>
               <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">ID: {artist.id.slice(0, 8)}</span>
            </div>
            
            <h1 className="text-8xl md:text-[14rem] font-black uppercase italic tracking-tighter leading-[0.75] font-syne">
              {artist.displayName.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "text-transparent stroke-white stroke-[2px] opacity-40" : "text-white"}>
                  {word} <br className="hidden md:block" />
                </span>
              ))}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-t border-white/5 pt-12">
            <div className="max-w-xl space-y-8">
               <p className="text-2xl text-white/40 font-medium italic leading-tight">
                 "{artist.bio || 'La excelencia no es una opción, es el estándar operativo de cada ejecución artística.'}"
               </p>
               <div className="flex flex-wrap gap-4">
                 {artist.genres.map((genre, i) => (
                   <span key={i} className="text-[10px] font-black uppercase tracking-widest border border-white/10 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#ecb613]/10 hover:border-[#ecb613]/30 transition-colors">
                     {genre}
                   </span>
                 ))}
               </div>
            </div>

            {/* 🎯 CALL TO ACTION: THE 1€ TRIGGER */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
               <Link 
                href={`/artistas/${artist.slug}/booking`}
                className="bg-white text-black px-12 py-7 rounded-2xl flex items-center justify-center gap-6 group hover:bg-[#ecb613] transition-all shadow-2xl shadow-white/5"
               >
                 <span className="text-xs font-black uppercase tracking-[0.4em]">Bloquear Fecha (1€)</span>
                 <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </Link>
               <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold text-center">Reserva instantánea sujeta a validación</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧬 MEDIAKIT BENTO: CONTENT & PROOF */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-8 h-[800px]">
          
          {/* Main Visual */}
          <div className="md:col-span-2 md:row-span-2 bg-white/5 border border-white/10 rounded-[3.5rem] relative overflow-hidden group">
            {artist.mediaKitUrl ? (
              <Image 
                src={artist.mediaKitUrl} 
                alt={artist.displayName} 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/5">
                <Mic2 size={200} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-0 left-0 p-12 space-y-4">
               <h3 className="text-4xl font-black uppercase italic tracking-tighter">Impacto Visual</h3>
               <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Media Kit Oficial v2026</p>
            </div>
          </div>

          {/* Metrics / Stats */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
             <div className="text-[#ecb613] opacity-50"><Star size={32} /></div>
             <div>
               <span className="text-4xl font-black italic font-syne">98%</span>
               <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-2">Nivel de Aura</p>
             </div>
          </div>

          {/* Social / Proof */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8">
             <h4 className="text-xs font-black uppercase tracking-widest text-white/20">Ecosistema Social</h4>
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-pointer">
                  <Instagram size={20} /> <span className="text-[10px] font-black uppercase tracking-widest">Connect</span>
                </div>
                <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-pointer">
                  <Youtube size={20} /> <span className="text-[10px] font-black uppercase tracking-widest">Watch</span>
                </div>
             </div>
          </div>

          {/* Technical / Rider Availability */}
          <div className="md:col-span-2 bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-[3.5rem] p-12 flex items-center justify-between group cursor-pointer hover:border-[#ecb613]/30 transition-all">
             <div className="flex items-center gap-8">
               <div className="p-6 bg-white/5 rounded-3xl text-white group-hover:bg-[#ecb613] group-hover:text-black transition-all">
                 <Download size={32} />
               </div>
               <div>
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">Rider Técnico</h3>
                 <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-2">v{artist.riders[0]?.version || '1.0'} · PDF Protegido</p>
               </div>
             </div>
             <ShieldCheck size={40} className="text-white/10 group-hover:text-[#ecb613] transition-colors" />
          </div>

        </div>
      </section>

      {/* 📅 CALENDAR: AVAILABILITY ENGINE */}
      <section className="py-40 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none italic">Motor de <br /><span className="text-[#ecb613]/40">Disponibilidad</span></h2>
            <p className="text-xl text-white/40 font-medium italic leading-relaxed">
              Sistema de sincronización en tiempo real con el Emanager Studio. Consulta disponibilidad inmediata para giras y eventos corporativos.
            </p>
            <div className="flex gap-10">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-[#ecb613] rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Bloqueado</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-white/10 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Disponible</span>
               </div>
            </div>
          </div>
          
          <div className="bg-[#0d0d0d] border border-white/5 p-12 rounded-[4rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
               <Calendar size={300} />
             </div>
             <div className="relative z-10">
                <div className="grid grid-cols-7 gap-4 mb-10">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-white/20 uppercase">{day}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-[11px] font-black border border-white/5 ${i % 7 === 3 ? 'bg-[#ecb613]/20 text-[#ecb613] border-[#ecb613]/20' : 'bg-white/5 text-white/40'}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613]">Ver Calendario Completo</span>
                   <Share2 size={16} className="text-white/20" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 🏛️ INSTITUTIONAL FOOTER: AUTHORITY */}
      <section className="py-40 px-6 max-w-4xl mx-auto text-center space-y-12">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#ecb613]/40 to-transparent mx-auto" />
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter italic">
          "La música trasciende el evento; <br />construimos <span className="text-[#ecb613]">legados</span> culturales."
        </h2>
        <div className="flex justify-center gap-8 text-white/20">
          <Music size={24} />
          <Globe size={24} />
          <ShieldCheck size={24} />
        </div>
      </section>
    </main>
  );
}
