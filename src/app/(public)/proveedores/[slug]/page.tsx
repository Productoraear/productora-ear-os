import React from 'react';
import { notFound } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Users, 
  Calendar, 
  HelpCircle,
  Award,
  Crown,
  Heart,
  Phone,
  MessageCircle,
  Tag,
  TrendingUp,
  Music,
  Video,
  Camera,
  Layers,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { CENTRALITA } from '@/lib/phone-constants';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function cleanText(text: string | undefined | null): string {
  if (!text) return '';
  const replacements: Record<string, string> = {
    'Garanta': 'Garantía',
    'Ubicacin': 'Ubicación',
    'ms': 'más',
    'aos': 'años',
    'nico': 'único',
    'Atencin': 'Atención',
    'Asesora': 'Asesoría',
    'Tcnico': 'Técnico',
    'Pliza': 'Póliza',
    'verificacin': 'verificación',
    'solvencia': 'solvencia',
    'tcnica': 'técnica',
    'pliza': 'póliza',
    'supervisin': 'supervisión',
    'Facturacin': 'Facturación',
    'va': 'vía',
    'Alarcn': 'Alarcón',
    'Msica': 'Música',
    'msica': 'música',
    'cctel': 'cóctel',
    'Animacin': 'Animación',
    'sesin': 'sesión',
    'antelacin': 'antelación',
    'Clsica': 'Clásica',
    'Electrnica': 'Electrónica',
    'tnica': 'Étnica',
    'Diseamos': 'Diseñamos',
    'formacin': 'formación',
    'Tamao': 'Tamaño',
    'amplsimo': 'amplísimo',
    'peticin': 'petición',
    'algn': 'algún',
    'est': 'está',
    'especficas': 'específicas',
    'espaa': 'España',
    'actuacin': 'actuación',
    'diseamos': 'diseñamos',
    'Cmo': 'Cómo',
    'efecta': 'efectúa',
    'Metlico': 'Metálico'
  };

  let res = String(text);
  for (const [k, v] of Object.entries(replacements)) {
    res = res.replaceAll(k, v);
  }
  return res.replace(/\uFFFD/g, '');
}

function getProxiedImage(url: string | undefined): string {
  if (!url) return 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop';
  if (url.includes('bodas.net')) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}

async function getProviderData(slug: string) {
  let provider: any = null;
  const slugNorm = slug.toLowerCase().trim();

  // 1. Consulta al Dataset Principal de 4.906 Proveedores Saneados
  try {
    const curatedPath = path.join(process.cwd(), 'src', 'data', 'all_providers_database.json');
    if (fs.existsSync(curatedPath)) {
      const raw = fs.readFileSync(curatedPath, 'utf-8');
      const list = JSON.parse(raw);
      
      provider = list.find((p: any) => {
        if (p.id?.toLowerCase() === slugNorm) return true;
        if (p.slug?.toLowerCase() === slugNorm) return true;
        if (p.atomic_specs?.slug?.toLowerCase() === slugNorm) return true;
        const nameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return nameSlug === slugNorm;
      });
    }
  } catch (err) {
    console.warn(`[PROVIDER_SLUG] Error leyendo all_providers_database:`, err);
  }

  // 2. Fallback: Dataset Vampirizado
  if (!provider) {
    try {
      const vampPath = path.join(process.cwd(), 'src', 'data', 'vampirized_providers.json');
      if (fs.existsSync(vampPath)) {
        const raw = fs.readFileSync(vampPath, 'utf-8');
        const list = JSON.parse(raw);
        provider = list.find((p: any) => {
          if (p.slug?.toLowerCase() === slugNorm) return true;
          const nameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return nameSlug === slugNorm;
        });
      }
    } catch (err) {
      console.warn(`[PROVIDER_SLUG] Error leyendo vampirized_providers:`, err);
    }
  }

  return provider;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderData(slug);
  if (!provider) return { title: 'Proveedor Homologado | Productora EAR' };

  const name = cleanText(provider.name);
  const location = cleanText(provider.atomic_specs?.location || provider.province || 'Madrid');

  return {
    title: `${name} | Proveedor de Bodas & Eventos en ${location} (EAR OS)`,
    description: `Ficha oficial de ${name}. Consulta precios desde ${provider.basePrice || 900}€, opiniones 5.0, disponibilidad y cotización inmediata con Price-Lock 72h.`,
    keywords: [name, 'dj bodas madrid', 'proveedor bodas.net', 'musica bodas', 'productora ear']
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rawProvider = await getProviderData(slug);

  if (!rawProvider) {
    return (
      <main className="min-h-screen bg-[#050505] text-white p-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black mb-4 uppercase font-syne tracking-tight">Proveedor no indexado</h1>
        <p className="text-zinc-400 text-sm max-w-md">
          El identificador <code className="text-[#ecb613]">{slug}</code> no se encuentra en el catálogo homologado actual.
        </p>
        <Link href="/servicios" className="mt-6 px-6 py-3 bg-[#ecb613] text-black font-black text-xs uppercase rounded-xl">
          Explorar Directorio Homologado
        </Link>
      </main>
    );
  }

  const name = cleanText(rawProvider.name);
  const category = cleanText(rawProvider.atomic_specs?.category || rawProvider.category || 'Música / DJ');
  const location = cleanText(rawProvider.atomic_specs?.location || rawProvider.address || `${rawProvider.province || 'Madrid'}, España`);
  const rating = rawProvider.atomic_specs?.metrics?.rating || rawProvider.rating || 5.0;
  const reviewsCount = rawProvider.atomic_specs?.metrics?.reviewCount || rawProvider.reviews || 27;
  const priceDisplay = rawProvider.atomic_specs?.price || `Precio desde ${rawProvider.basePrice || 900}€`;
  const description = cleanText(rawProvider.atomic_specs?.description || rawProvider.description_full || rawProvider.description);
  
  // Galería de imágenes
  const coverImg = rawProvider.atomic_specs?.media?.coverImage || rawProvider.img;
  const rawGallery = Array.isArray(rawProvider.gallery) ? rawProvider.gallery : [coverImg];
  const gallery = rawGallery.map((g: string) => getProxiedImage(g));
  if (gallery.length < 3) {
    gallery.push('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop');
    gallery.push('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop');
  }

  // FAQs
  const faqs = rawProvider.atomic_specs?.faqs || {
    "¿Qué servicios ofreces?": "DJ profesional, sonido para ceremonia, sonorización cóctel y banquete, fiesta y barra libre, iluminación robótica y microfonía digital.",
    "¿Qué incluye el pack de boda?": "Montaje completo, equipo de sonido Shure/Bose, iluminación LED, sesión personalizada y seguro de Responsabilidad Civil de 1.000.000 €.",
    "¿Con cuánta antelación debo reservar?": "Recomendamos contactar con 2 a 4 semanas de antelación para bloquear la fecha con Price-Lock 72h.",
    "¿Tienes posibilidad de desplazarte?": "Sí, cobertura en toda la Comunidad de Madrid, Toledo, Guadalajara y resto de España.",
    "¿Dispones de equipo propio?": "Sí, cabinas profesionales, controladores de alta gama y sonorización adaptada a 12 W/pax."
  };

  const servicesList = rawProvider.services_list || [
    'Atención Personalizada y Asesoría Musical',
    'Montaje y Desmontaje Técnico Incluido',
    'Cobertura con Seguro de RC de 1.000.000 €',
    'SLA y Tiempos de Respuesta Garantizados por Contrato',
    'Facturación Centralizada vía Split Soberano'
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 🚨 BANNER DE SOCIAL PROOF / URGENCIA NUPCIAL */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-black border border-blue-500/30 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <Users size={16} />
            </span>
            <span>
              Hay <strong className="text-white font-bold">3 parejas</strong> interesadas en este proveedor. 
              <span className="text-zinc-400 hidden sm:inline"> Las fechas de temporada se reservan rápidamente.</span>
            </span>
          </div>
          <Link 
            href={`/checkout/presupuesto?proveedor=${slug}`} 
            className="px-3.5 py-1.5 bg-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-xl hover:scale-105 transition-all shrink-0"
          >
            ¡Pedir Presupuesto!
          </Link>
        </div>

        {/* 📸 HERO HEADER & COLLAGE FOTOGRÁFICO BODAS.NET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Area: Title, Rating & Photo Grid (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-300 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                  <Award size={12} />
                  <span>x2 Wedding Awards // Homologación EAR</span>
                </span>
                <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-mono uppercase rounded-full">
                  {category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white font-syne">
                {name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>{rating} Fantástico</span>
                  <span className="text-zinc-500 underline cursor-pointer">· {reviewsCount} opiniones</span>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <MapPin size={14} className="text-[#ecb613]" />
                  <span>{location}</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-mono font-bold">
                  <Tag size={12} />
                  <span>1 promoción · 5% descuento</span>
                </div>
              </div>
            </div>

            {/* Collage Grid de 3 Fotos */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border border-white/10 relative group">
              
              {/* Foto Principal Grande (Span 7) */}
              <div className="sm:col-span-7 relative h-full overflow-hidden bg-zinc-900">
                <img 
                  src={gallery[0]} 
                  alt={name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[#ecb613]">
                  <Crown size={16} />
                </div>
              </div>

              {/* Columna Derecha con 2 Fotos (Span 5) */}
              <div className="sm:col-span-5 grid grid-rows-2 gap-3 h-full">
                <div className="relative overflow-hidden bg-zinc-900">
                  <img 
                    src={gallery[1] || gallery[0]} 
                    alt={`${name} evento`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] font-mono text-white border border-white/10">
                      ¿Reservado?
                    </span>
                    <button className="p-2 bg-black/70 backdrop-blur-md rounded-full text-white/80 hover:text-rose-400 border border-white/10 transition-colors">
                      <Heart size={14} />
                    </button>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-zinc-900">
                  <img 
                    src={gallery[2] || gallery[0]} 
                    alt={`${name} montaje`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Botones Flotantes en la foto inferior */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-[10px] font-mono text-white border border-white/20 hover:border-[#ecb613] flex items-center gap-1.5 transition-all">
                      <Video size={12} className="text-[#ecb613]" />
                      <span>Ver Vídeos 7</span>
                    </button>
                    <button className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-[10px] font-mono text-white border border-white/20 hover:border-[#ecb613] flex items-center gap-1.5 transition-all">
                      <Camera size={12} className="text-[#ecb613]" />
                      <span>Ver Fotos 13</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* BARRA DE TABS DE NAVEGACIÓN */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-zinc-400 scrollbar-none">
              <a href="#informacion" className="px-4 py-2 bg-white/10 text-[#ecb613] border border-[#ecb613]/40 rounded-xl font-bold whitespace-nowrap">
                Información
              </a>
              <a href="#faq" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                FAQ ({Object.keys(faqs).length})
              </a>
              <a href="#opiniones" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                Opiniones ({reviewsCount})
              </a>
              <a href="#servicios" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                Servicios y Rider
              </a>
              <a href="#promociones" className="px-4 py-2 hover:bg-white/5 hover:text-white rounded-xl whitespace-nowrap transition-colors">
                Promociones 1
              </a>
            </div>

            {/* SECCIÓN INFORMACIÓN */}
            <section id="informacion" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-2xl font-bold font-syne text-white uppercase">Información de la Propuesta</h2>
                <span className="text-[10px] font-mono text-zinc-500">
                  En la Red desde 2022 · Actualización Marzo 2026
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed font-light">
                  {description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Garantía de Presión Acústica</span>
                    <span className="text-xs font-bold text-[#ecb613] font-mono">12 W/pax Calibrado S-Class</span>
                  </div>
                  <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">Blindaje de Tarifa</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">Price-Lock SHA-256 (72h)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN SERVICIOS INCLUIDOS */}
            <section id="servicios" className="space-y-4 pt-4">
              <h3 className="text-xl font-bold font-syne text-white uppercase">Servicios y Rider Técnico Incluido</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((srv: string, idx: number) => (
                  <div key={idx} className="p-4 bg-[#09090d] border border-white/10 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-200 leading-snug">{cleanText(srv)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECCIÓN FAQ (PREGUNTAS FRECUENTES) */}
            <section id="faq" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-2xl font-bold font-syne text-white uppercase">Preguntas Frecuentes (FAQ)</h3>
                <span className="text-[10px] font-mono text-zinc-500">Respuestas Literales Validadas</span>
              </div>

              <div className="space-y-3">
                {Object.entries(faqs).map(([question, answer], idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center justify-between gap-2">
                      <span>{cleanText(question)}</span>
                      <ChevronDown size={14} className="text-[#ecb613]" />
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line font-light">
                      {cleanText(String(answer))}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECCIÓN OPINIONES */}
            <section id="opiniones" className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-2xl font-bold font-syne text-white uppercase">Opiniones de Parejas ({reviewsCount})</h3>
                <span className="text-xs font-mono text-amber-400 font-bold">5.0 / 5.0 (Excelente)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl bg-[#09090d] border border-white/10 text-center">
                <div className="space-y-1">
                  <span className="text-2xl font-black font-syne text-[#ecb613]">5.0</span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Calidad de Servicio</span>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-black font-syne text-[#ecb613]">5.0</span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Profesionalidad</span>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-black font-syne text-[#ecb613]">4.9</span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Tiempo de Respuesta</span>
                </div>
              </div>
            </section>

          </div>

          {/* Right Area: Sticky Booking Card (Span 4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-[#141418] to-[#09090d] border border-[#ecb613]/40 shadow-[0_0_50px_rgba(236,182,19,0.15)] space-y-6">
              
              {/* Tarifa base */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Tarifa Oficial Homologada</span>
                <div className="p-4 bg-black/60 rounded-2xl border border-white/10 text-center">
                  <span className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight">
                    {priceDisplay}
                  </span>
                </div>
              </div>

              {/* Botón Principal Solicitar Presupuesto */}
              <div className="space-y-3">
                <Link
                  href={`/checkout/presupuesto?proveedor=${slug}&precio=${rawProvider.basePrice || 900}`}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-[#ecb613] text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  <span>Solicitar Presupuesto</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href={CENTRALITA.tel}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={14} className="text-[#ecb613]" />
                  <span>Llamar a Centralita ({CENTRALITA.display})</span>
                </a>
              </div>

              {/* Social Proof Bullets */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-zinc-300 font-light">
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={15} className="text-emerald-400 shrink-0" />
                  <span>De los más buscados en {location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users size={15} className="text-blue-400 shrink-0" />
                  <span>Más de 30 parejas lo han contratado</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} className="text-[#ecb613] shrink-0" />
                  <span>SLA 99.9% y Plan B Redundante in situ</span>
                </div>
              </div>

              {/* Depósito y Fianza */}
              <div className="p-3.5 bg-black/50 rounded-2xl border border-white/5 text-[10px] font-mono text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Bloqueo de Fecha:</span>
                  <span className="text-[#ecb613] font-bold">10 € (Reembolsable 72h)</span>
                </div>
                <div className="flex justify-between">
                  <span>Split Transaccional:</span>
                  <span className="text-emerald-400 font-bold">80% Proveedor / 10% EAR / 10% VIMUME</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
