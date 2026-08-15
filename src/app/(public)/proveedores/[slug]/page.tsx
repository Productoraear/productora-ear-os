import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ShieldCheck, Lock, Sparkles, Image as ImageIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProviderShadowProfilePage({ params }: PageProps) {
  const { slug } = await params;

  let shadowProfile = null;
  try {
    shadowProfile = await prisma.vendorShadowProfile.findUnique({
      where: { slug }
    });
  } catch (e) {
    console.warn(`[SHADOW_PROFILE_PAGE] Fallback DB query for ${slug}:`, e);
  }

  if (!shadowProfile) {
    return (
      <main className="min-h-screen bg-[#050505] text-white p-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">Perfil no encontrado</h1>
        <p className="text-slate-400 text-sm max-w-md">
          El proveedor <code className="text-[#ecb613]">{slug}</code> aún no ha sido indexado en la Bóveda de Perfiles Sombra.
        </p>
        <Link href="/" className="mt-6 text-xs text-[#ecb613] uppercase tracking-widest underline">Volver al Ecosistema</Link>
      </main>
    );
  }

  const claimUrl = `/login?from=/claim/verify?token=${shadowProfile.claimToken}&role=proveedor`;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ecb613] selection:text-black">
      
      {/* BANNER RECLAMACIÓN S-CLASS */}
      {!shadowProfile.isClaimed && (
        <div className="bg-[#ecb613]/10 border-b border-[#ecb613]/30 px-6 py-3 text-center flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4 text-[#ecb613] animate-pulse shrink-0" />
          <span className="text-xs text-slate-200">
            ¿Eres el propietario de <strong>{shadowProfile.rawName}</strong>? Toma el control de tus reservas.
          </span>
          <Link 
            href={claimUrl}
            className="bg-[#ecb613] text-black font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider hover:bg-[#d4a210] transition-all ml-2"
          >
            Reclamar Perfil Gratuito <ArrowRight className="w-3 h-3 inline ml-1" />
          </Link>
        </div>
      )}

      {/* HEADER ESCAPARATE SOMBRA */}
      <section className="pt-16 pb-12 px-6 md:px-12 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[#ecb613] border border-[#ecb613]/30 px-3 py-1 rounded-full uppercase tracking-widest bg-[#ecb613]/5">
            Directorio Sombra EAR OS · {shadowProfile.isClaimed ? 'Verificado' : 'Sin Reclamar'}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
          {shadowProfile.rawName}
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
          {shadowProfile.description || 'Perfil profesional registrado en el Ecosistema EAR OS. Equipamiento técnico Bose F1 y Behringer XR18 pre-homologado.'}
        </p>

        {/* GALERÍA DE IMÁGENES EXTRAÍDAS */}
        {shadowProfile.extractedImages && shadowProfile.extractedImages.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#ecb613]" /> Galería de Instalaciones & Equipamiento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shadowProfile.extractedImages.slice(0, 4).map((imgUrl, i) => (
                <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={`${shadowProfile.rawName} - ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOQUE RECLAMACIÓN FOOTER */}
        <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-3xl mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white uppercase">¿Gestionas este espacio o servicio?</h4>
            <p className="text-slate-400 text-xs">
              Reclama tu perfil en 1 clic a través de SovereignLogin y gestiona reservas con el Split 80/10/10 en vivo.
            </p>
          </div>
          <Link
            href={claimUrl}
            className="bg-white text-black font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest hover:bg-[#ecb613] transition-all shrink-0"
          >
            Reclama tu Perfil en SovereignLogin
          </Link>
        </div>
      </section>

    </div>
  );
}
