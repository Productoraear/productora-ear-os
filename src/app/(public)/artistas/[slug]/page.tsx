import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { HIGH_VALUE_VARIANTS, SEOVariant } from '@/lib/artists/matrix';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Music, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Users,
  Clock,
  Phone
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const variant = HIGH_VALUE_VARIANTS.find(v => v.slug === slug);
  
  if (variant) {
    return {
      title: variant.title,
      description: variant.metaDescription,
      alternates: {
        canonical: `https://productoraear.com/artistas/${slug}`,
      },
      openGraph: {
        title: variant.title,
        description: variant.metaDescription,
        url: `https://productoraear.com/artistas/${slug}`,
        siteName: 'Productora EAR',
        locale: 'es_ES',
        type: 'profile'
      }
    };
  }

  return {
    title: `Artista ${slug} | Productora EAR`,
    description: 'Perfil y rider técnico oficial en Productora EAR',
    alternates: {
      canonical: `https://productoraear.com/artistas/${slug}`,
    },
  };
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. COMPROBACIÓN EN MATRIZ DE ALTO VALOR (HIGH_VALUE_VARIANTS)
  const variant = HIGH_VALUE_VARIANTS.find(v => v.slug === slug);

  if (variant) {
    const basePrice = variant.showType === 'solista' ? 350 : variant.showType === 'mariachi-6' ? 850 : variant.showType === 'show-caballo' ? 1200 : 2400;

    return (
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 font-sans selection:bg-[#ecb613]/30">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          
          {/* HEADER / HERO DE ARTISTA (EXACTAMENTE UN H1) */}
          <header className="space-y-6 text-center max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 font-mono flex items-center gap-1.5">
                <Sparkles size={12} /> S-Class Artist Matrix
              </span>
              <span className="px-3.5 py-1 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 uppercase">
                <MapPin size={12} className="inline mr-1 text-[#ecb613]" />
                {variant.city}
              </span>
              <span className="px-3.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 uppercase">
                {variant.eventType.toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight text-white font-syne">
              {variant.title}
            </h1>

            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              {variant.uniqueDescription}
            </p>
          </header>

          {/* TARJETA PRINCIPAL DE ESPECIFICACIONES (H2) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: DETALLES Y REPERTORIO */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Formato y Puesta en Escena */}
              <div className="p-8 rounded-3xl bg-[#0a0a0d] border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-black uppercase italic text-white font-syne">
                    Formato: <span className="text-[#ecb613]">{variant.showTypeName}</span>
                  </h2>
                  <span className="text-xs font-mono text-zinc-500">Protocolo S-Class</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Dirección Artística</span>
                    <span className="text-sm font-bold text-white">Edwin Agudelo (Tenor)</span>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Sonido & Presión</span>
                    <span className="text-sm font-bold text-[#ecb613]">12 W/pax · Bose F1 / L-Acoustics</span>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Seguro de Actuación</span>
                    <span className="text-sm font-bold text-emerald-400">RC 600.000 € Incluida</span>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Garantía Operativa</span>
                    <span className="text-sm font-bold text-white">Puntualidad Milimétrica</span>
                  </div>
                </div>
              </div>

              {/* Logística Local */}
              <div className="p-8 rounded-3xl bg-[#0a0a0d] border border-white/10 space-y-4">
                <h2 className="text-xl font-black uppercase text-white font-syne flex items-center gap-2">
                  <MapPin className="text-[#ecb613]" size={20} />
                  Logística y Desplazamiento en {variant.city}
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {variant.localLogistics}
                </p>
              </div>

              {/* Repertorio Sugerido */}
              <div className="p-8 rounded-3xl bg-[#0a0a0d] border border-white/10 space-y-4">
                <h2 className="text-xl font-black uppercase text-white font-syne flex items-center gap-2">
                  <Music className="text-[#ecb613]" size={20} />
                  Repertorio Destacado de Gala
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {variant.suggestedRepertoire.map((tema, i) => (
                    <div key={i} className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-[#ecb613] shrink-0" />
                      <span className="text-sm text-zinc-200 font-medium">"{tema}"</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA: TARJETA DE RESERVA Y STRIPE */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#141418] to-[#09090d] border border-[#ecb613]/40 shadow-[0_0_50px_rgba(236,182,19,0.15)] space-y-6">
                
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Tarifa Base Estimada</span>
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/10 text-center">
                    <span className="text-3xl sm:text-4xl font-black font-syne text-[#ecb613] tracking-tight">
                      Desde {basePrice} €
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1">IVA no incluido · Tarifa cerrada</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Link 
                    href={`/checkout/presupuesto?artista=${slug}&precio=${basePrice}`}
                    className="w-full py-4 bg-[#ecb613] text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white transition-all text-center block shadow-lg shadow-[#ecb613]/10"
                  >
                    Bloquear Fecha (Smart-Lock 10€)
                  </Link>

                  <a 
                    href={`https://wa.me/${CENTRALITA.raw}?text=${encodeURIComponent(`Hola Productora EAR, deseo contratar ${variant.title} en ${variant.city}. Precio de referencia: desde ${basePrice}€.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold uppercase tracking-wider text-xs rounded-2xl transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Phone size={14} className="text-[#ecb613]" /> Consultar por WhatsApp
                  </a>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                    <span>Factura oficial con NIF y Split Soberano</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-amber-400 shrink-0" />
                    <span>Garantía de sustitución en &lt;2 horas</span>
                  </div>
                </div>

              </div>
            </div>

          </section>

        </div>
      </main>
    );
  }

  // 2. COMPROBACIÓN EN BASE DE DATOS PRISMA
  let artist = null;
  try {
    artist = await prisma.artistProfile.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
            displayName: true,
          }
        }
      }
    });
  } catch (e) {
    console.warn(`[ARTIST_PAGE] DB query fallback for slug ${slug}:`, e);
  }

  if (artist) {
    const artistName = artist.stageName || artist.displayName || artist.user?.displayName || artist.user?.name || slug;

    return (
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 font-sans selection:bg-[#ecb613]/30">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <header className="space-y-4">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/30 uppercase">
              Artista Homologado EAR
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tight text-white font-syne">
              {artistName}
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {artist.bio || 'Perfil artístico homologado por Productora EAR.'}
            </p>
          </header>
          
          <div className="p-8 rounded-3xl bg-[#0a0a0d] border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-lg font-bold text-white">Contratación Directa S-Class</h2>
              <p className="text-xs text-zinc-400">Reserva con seguro de actuación y rider técnico garantizado.</p>
            </div>
            <Link 
              href={`/checkout/presupuesto?artista=${slug}`}
              className="px-8 py-4 bg-[#ecb613] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all"
            >
              Pedir Presupuesto
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. COMPROBACIÓN EN DATA LAKE DE PROVEEDORES Y CELEBRENTS (musica.json)
  try {
    const fs = await import('fs');
    const path = await import('path');
    const musicaPath = path.join(process.cwd(), 'public', 'data', 'providers', 'musica.json');
    if (fs.existsSync(musicaPath)) {
      const items = JSON.parse(fs.readFileSync(musicaPath, 'utf-8'));
      const cleanSlug = slug.toLowerCase().trim();
      const matched = items.find((item: any) => {
        const itemSlug = (item.slug || '').toLowerCase();
        const itemId = (item.id || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase().replace(/[\s\-_]+/g, '-');
        return itemSlug === cleanSlug || itemSlug.includes(cleanSlug) || cleanSlug.includes(itemSlug) || itemId === cleanSlug || itemName.includes(cleanSlug);
      });

      if (matched) {
        const title = matched.name || slug;
        const province = matched.province || 'España';
        const description = matched.description || matched.description_full || 'Artista musical auditado con sonorización Bose F1 y garantía de actuación S-Class.';
        const basePrice = matched.basePrice || 350;
        const rating = matched.rating ? Number(matched.rating).toFixed(1) : '5.0';
        const reviews = matched.reviews || 28;
        const photos: string[] = (matched.imageUrls && matched.imageUrls.length > 0)
          ? matched.imageUrls
          : (matched.gallery && matched.gallery.length > 0)
          ? matched.gallery
          : [matched.img || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4'];

        return (
          <main className="min-h-screen bg-[#050505] text-white pt-20 pb-12 font-sans selection:bg-[#ecb613]/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
              
              {/* VISTA COMPACTA "DE UN VISTAZO" (ABOVE THE FOLD) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* IZQUIERDA: FOTO HD PRINCIPAL Y MINIATURAS */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/10 relative bg-black/60 shadow-2xl">
                    <img 
                      src={photos[0]} 
                      alt={title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#ecb613] border border-[#ecb613]/30 uppercase font-bold flex items-center gap-1">
                      <Sparkles size={11} /> Artista Verificado S-Class
                    </div>
                  </div>

                  {photos.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photos.slice(1, 4).map((p, idx) => (
                        <img key={idx} src={p} alt={`${title} foto ${idx+2}`} className="h-20 w-full object-cover rounded-xl border border-white/10" />
                      ))}
                    </div>
                  )}
                </div>

                {/* DERECHA: TÍTULO, ESPECIFICACIONES, TARIFA Y BOTONES DE ACCIÓN */}
                <div className="lg:col-span-7 bg-[#09090d] border border-white/10 p-6 rounded-3xl flex flex-col justify-between shadow-2xl space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                      <span className="px-2.5 py-0.5 rounded-full text-zinc-300 bg-white/5 border border-white/10 uppercase">
                        <MapPin size={11} className="inline mr-1 text-[#ecb613]" />
                        {province}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 uppercase">
                        Split 80/10/10
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase flex items-center gap-1">
                        <Star size={11} className="fill-amber-400" /> {rating}/5.0 ({reviews} opiniones)
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-syne leading-tight">
                      {title}
                    </h1>

                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light">
                      {description}
                    </p>
                  </div>

                  {/* MINI RIDER ACÚSTICO */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-2 border-t border-white/10">
                    <div className="p-2.5 bg-black/50 rounded-xl border border-white/5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Sonorización</span>
                      <span className="font-bold text-[#ecb613]">12 W/pax · Bose F1 / S1 Pro</span>
                    </div>
                    <div className="p-2.5 bg-black/50 rounded-xl border border-white/5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Microfonía</span>
                      <span className="font-bold text-white">Shure Beta 87A RF</span>
                    </div>
                  </div>

                  {/* BLOQUE DE TARIFA Y CTAS DIRECTAS */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest block">Tarifa Base Estimada</span>
                      <span className="text-2xl sm:text-3xl font-black font-syne text-[#ecb613]">
                        Desde {basePrice} €
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a 
                        href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, deseo consultar presupuesto para el artista ${title} en ${province}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Phone size={13} className="text-[#ecb613]" /> WhatsApp
                      </a>

                      <Link 
                        href={`/checkout/presupuesto?artista=${slug}&precio=${basePrice}`}
                        className="flex-1 sm:flex-initial px-5 py-3 bg-[#ecb613] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all text-center shadow-lg shadow-[#ecb613]/10"
                      >
                        Reserva 100€
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        );
      }
    }
  } catch (err) {
    console.warn(`[ARTIST_PAGE] Data lake fallback error for slug ${slug}:`, err);
  }

  // 4. FALLBACK LIMPIO CON UN SOLO H1
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 font-sans flex flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-6">
        <span className="px-3.5 py-1 rounded-full text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/30 uppercase">
          Bóveda de Artistas EAR
        </span>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white font-syne">
          Artista: {slug}
        </h1>
        <p className="text-zinc-400 text-sm">
          Perfil en proceso de sincronización con la Bóveda de Talento EAR.
        </p>
        <Link 
          href="/artistas" 
          className="inline-block px-6 py-3 bg-white/10 hover:bg-[#ecb613] hover:text-black text-white font-bold text-xs uppercase rounded-xl transition-all font-mono"
        >
          Volver al Catálogo de Artistas
        </Link>
      </div>
    </main>
  );
}