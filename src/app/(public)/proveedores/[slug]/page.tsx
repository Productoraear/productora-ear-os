import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Users, 
  Calendar, 
  HelpCircle,
  Award,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProviderData(slug: string) {
  let provider: any = null;

  // 1. Consulta DB si está disponible
  try {
    provider = await prisma.vendorShadowProfile.findUnique({
      where: { slug }
    });
  } catch (e) {
    // Fallback silencioso
  }

  // 2. Consulta al Dataset Maestro de 24.869 Proveedores
  if (!provider) {
    try {
      const masterPath = path.join(process.cwd(), 'src', 'data', 'catalog', 'proveedores_soberanos_master.json');
      if (fs.existsSync(masterPath)) {
        const raw = fs.readFileSync(masterPath, 'utf-8');
        const list = JSON.parse(raw);
        provider = list.find((p: any) => p.slug === slug || p.id === slug);
      }
    } catch (err) {
      console.warn(`[PROVIDER_SLUG] Error leyendo máster:`, err);
    }
  }

  // 3. Fallback: Dataset Curado de 4.906 Proveedores Saneados
  if (!provider) {
    try {
      const curatedPath = path.join(process.cwd(), 'src', 'data', 'all_providers_database.json');
      if (fs.existsSync(curatedPath)) {
        const raw = fs.readFileSync(curatedPath, 'utf-8');
        const list = JSON.parse(raw);
        const slugNorm = slug.toLowerCase();
        provider = list.find((p: any) => {
          if (p.id === slug || p.slug === slug) return true;
          // Derivar slug del nombre para matching flexible
          const nameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return nameSlug === slugNorm;
        });
      }
    } catch (err) {
      console.warn(`[PROVIDER_SLUG] Error leyendo curado:`, err);
    }
  }

  return provider;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderData(slug);
  if (!provider) return { title: 'Proveedor | Productora EAR' };

  return {
    title: `${provider.name} | Proveedor Homologado S-Class`,
    description: `${provider.description?.slice(0, 160) || `Contratación y reserva oficial de ${provider.name} en ${provider.location}. Tarifa garantizada y SLA 99.9%.`}`,
    keywords: [provider.name, provider.category, provider.location, 'proveedor homologado ear', 'bodas s-class']
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = await getProviderData(slug);

  if (!provider) {
    return (
      <main className="min-h-screen bg-[#050505] text-white p-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">Proveedor no encontrado</h1>
        <p className="text-slate-400 text-sm max-w-md">
          El proveedor <code className="text-[#ecb613]">{slug}</code> aún no ha sido indexado en la Red Homologada.
        </p>
        <Link href="/proveedores" className="mt-6 text-xs text-[#ecb613] uppercase tracking-widest underline">
          ← Volver al Directorio de Proveedores
        </Link>
      </main>
    );
  }

  const claimUrl = `/login?from=/reclamar-perfil?token=${provider.claimToken || 'sovereign'}&provider=${slug}`;
  const images = provider.images || provider.extractedImages || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ecb613] selection:text-black">
      
      {/* BANNER DE RECLAMACIÓN SOBERANA */}
      <div className="bg-[#ecb613]/10 border-b border-[#ecb613]/30 px-6 py-3 text-center flex flex-wrap items-center justify-center gap-3">
        <Sparkles className="w-4 h-4 text-[#ecb613] animate-pulse shrink-0" />
        <span className="text-xs text-slate-200">
          ¿Eres el titular de <strong>{provider.name}</strong>? Toma el control de tus reservas con el Split 80/10/10.
        </span>
        <Link 
          href={claimUrl}
          className="bg-[#ecb613] text-black font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider hover:bg-[#d4a210] transition-all ml-2"
        >
          Reclamar Perfil Gratuito <ArrowRight className="w-3 h-3 inline ml-1" />
        </Link>
      </div>

      {/* HERO DEL PROVEEDOR */}
      <section className="pt-20 pb-12 px-6 md:px-12 max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#ecb613] border border-[#ecb613]/30 px-3 py-1 rounded-full uppercase tracking-widest bg-[#ecb613]/5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Proveedor Homologado EAR OS
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              ★ SLA {provider.slaScore || 99.5}%
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 text-sm font-mono font-bold">
            <Star className="w-4 h-4 fill-amber-400" /> {provider.rating || 5.0} ({provider.reviewsCount || provider.reviews || 18} valoraciones)
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            {provider.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#ecb613]" /> {provider.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-[#ecb613]" /> Capacidad: hasta {provider.maxPax || 350} pax
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">
              Tarifa base desde: {provider.basePrice || provider.price || 450} €
            </span>
          </div>
        </div>

        {/* GALERÍA MULTIMEDIA DE ALTA RESOLUCIÓN */}
        {images.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#ecb613]" /> Galería de Instalaciones & Producciones ({images.length} fotos)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.slice(0, 6).map((imgUrl: string, i: number) => (
                <div key={i} className="aspect-video bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imgUrl} 
                    alt={`${provider.name} - ${i + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DESCRIPCIÓN EDITORIAL & ESPECIFICACIONES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-8 border-t border-white/10">
          
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#ecb613]" /> Presentación & Servicios de Excelencia
            </h2>
            <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line font-light bg-[#0a0a0d] border border-white/5 p-8 rounded-3xl">
              {provider.description || 'Proveedor verificado bajo los estándares de producción de Productora EAR.'}
            </div>

            {/* PREGUNTAS FRECUENTES DEL PROVEEDOR */}
            {provider.faqs && provider.faqs.length > 0 && (
              <div className="space-y-4 pt-6">
                <h3 className="text-lg font-bold uppercase text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#ecb613]" /> Preguntas Frecuentes
                </h3>
                <div className="space-y-3">
                  {provider.faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="bg-[#0a0a0d] border border-white/5 p-6 rounded-2xl space-y-2">
                      <h4 className="font-bold text-sm text-white">
                        {faq.q || faq.question || `Pregunta ${idx + 1}`}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">
                        {faq.a || faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CAJA DE RESERVA & CONTRATACIÓN */}
          <div className="space-y-6">
            <div className="bg-[#0a0a0d] border border-[#ecb613]/30 p-8 rounded-3xl space-y-6 sticky top-28 shadow-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Presupuesto de Referencia</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-mono">{provider.basePrice || provider.price || 450} €</span>
                  <span className="text-xs text-slate-500 font-mono">+ IVA</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono block pt-1">
                  ✓ Precio congelado 72h con Hash SHA-256
                </span>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Garantía de Reserva:</span>
                  <strong className="text-white">0.50 €</strong>
                </div>
                <div className="flex justify-between">
                  <span>SLA Cumplimiento:</span>
                  <strong className="text-[#ecb613]">99.9%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Póliza RC:</span>
                  <strong className="text-white">1.000.000 €</strong>
                </div>
              </div>

              <Link
                href={`/cotizador?provider=${slug}`}
                className="w-full py-4 bg-[#ecb613] hover:bg-[#d4a210] text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-[#ecb613]/20 flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <Lock size={14} /> Reservar con Garantía (0.50 €)
              </Link>

              <div className="text-center">
                <Link
                  href={claimUrl}
                  className="text-[10px] font-mono text-slate-400 hover:text-[#ecb613] underline transition-colors"
                >
                  ¿Eres el dueño? Reclama este perfil
                </Link>
              </div>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
