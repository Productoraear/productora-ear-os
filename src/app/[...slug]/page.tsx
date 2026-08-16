import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { DemandEngine } from '@/modules/SClassScreens/DemandEngine';
import { Zap, ArrowRight, ShieldCheck, Star, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';
import { ROUTES } from '@/lib/routes';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// 🛡️ LISTA BLANCA DE MÓDULOS NATIVOS ESTÁTICOS (DEBEN SER IGNORADOS POR EL CATCH-ALL)
const CORE_STATIC_ROUTES = new Set([
  '', 'about', 'academia', 'afiliados', 'arsenal', 'artistas', 'artists', 'aviso-legal',
  'ayuntamientospremium', 'ayuntamientos-premium', 'blog', 'bodas', 'calculadora',
  'categorias', 'checkout', 'contacto', 'cookies', 'cotizador', 'dossier', 'dossier-seo',
  'empresarios', 'eventos', 'infraestructura', 'journal', 'marketplace',
  'ocasiones', 'precios', 'presupuesto', 'privacidad', 'proveedores',
  'proyectos', 'reclamar-perfil', 'servicios', 'soberania-tecnica', 'social',
  'the-signal', 'vimume', 'login', 'register', 'admin', 'nexus', 'dashboard',
  'studio', 'api', 'guia-estrategica', 'casos-exito', 'subasta', 'metodologia',
  'prensa', 'terms', 'privacy', 'directorio', 'wedding-planners', 'business', 'comparativas-premium'
]);

// 🏷️ CATEGORÍAS PROGRAMÁTICAS S-CLASS
const PROGRAMMATIC_VERTICALS = new Set([
  'weddings', 'production', 'arsenal', 'tools', 'artistas', 'titan', 'eventos', 'bodas'
]);

function formatTitle(slugArray: string[]) {
  const lastSegment = slugArray[slugArray.length - 1];
  return lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace('Ear', 'EAR')
    .replace('Ai', 'IA')
    .replace('Dj', 'DJ');
}

import { generateSemanticPageData } from '@/lib/seo/semantic-engine';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};
  
  if (slug.length === 1 && CORE_STATIC_ROUTES.has(slug[0].toLowerCase())) {
    return {};
  }

  const semantic = generateSemanticPageData(slug, slug.length >= 2 ? slug[0] : undefined);

  return {
    title: semantic.title,
    description: semantic.metaDescription,
    keywords: semantic.localKeywords,
    openGraph: {
      title: semantic.title,
      description: semantic.metaDescription,
      images: ['/og-image-vimume.jpg'],
    }
  };
}

export default async function UniversalOmegaPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const rootPrefix = slug[0].toLowerCase();

  // 1. SI ES UNA RUTA ESTÁTICA NATIVA DE UN SOLO SEGMENTO, DELEGAR AL ROUTER NATIVO (404 EN CATCH-ALL)
  if (slug.length === 1 && CORE_STATIC_ROUTES.has(rootPrefix)) {
    notFound();
  }

  // 2. CASO A: LANDING TERRITORIAL PURA (Ej: /madrid, /barcelona, /valencia, /toledo)
  const isProvincia = PROVINCIAS.includes(rootPrefix);
  if (slug.length === 1) {
    if (!isProvincia) {
      notFound();
    }

    const provinceTitle = formatTitle(slug);

    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 selection:text-white font-inter">
        {/* NAVEGACIÓN BLINDADA */}
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-3xl py-5 px-10 flex justify-between items-center border-b border-white/5">
          <Link href="/" className="text-2xl font-black tracking-tighter hover:text-[#ecb613] transition-all uppercase">
            EAR<span className="text-[#ecb613]">OS</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-[10px] uppercase font-black tracking-[0.3em] text-white/40">
            <Link href="/artistas" className="hover:text-[#ecb613] transition-colors">Artistas</Link>
            <Link href="/eventos" className="hover:text-[#ecb613] transition-colors">Producción</Link>
            <Link href={ROUTES.contacto} className="bg-[#ecb613] text-black px-6 py-2.5 rounded-full hover:scale-105 transition-transform">Contacto</Link>
          </div>
        </nav>

        <main className="pt-32 pb-20 space-y-32">
          {/* HERO PROVINCIA */}
          <section className="relative px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ecb613]/10 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-[#ecb613]" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                  Presencia Territorial • {provinceTitle}
                </span>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase max-w-5xl">
                DOMINANCIA EN <br/>
                <span className="text-[#ecb613] italic">{provinceTitle}</span>
              </h1>

              <p className="text-xl md:text-3xl text-white/50 max-w-4xl leading-tight font-light italic">
                "Infraestructura técnica, riders acústicos homologados y contratación artística de élite en {provinceTitle}."
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-10">
                <Link 
                  href="/cotizador"
                  className="bg-[#ecb613] text-black px-16 py-7 rounded-2xl font-black uppercase text-xs tracking-[0.4em] shadow-[0_20px_50px_rgba(212,168,85,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-4"
                >
                  COTIZADOR S-CLASS <Zap className="w-5 h-5" />
                </Link>
                <Link 
                  href="#servicios"
                  className="bg-white/5 border border-white/10 text-white px-16 py-7 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-4 backdrop-blur-xl"
                >
                  SERVICIOS EN {provinceTitle.toUpperCase()} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                  { label: "Eventos en " + provinceTitle, val: "500+", icon: Star },
                  { label: "Clientes VIP", val: "120+", icon: Users },
                  { label: "SLA Operativo", val: "99.9%", icon: ShieldCheck },
                  { label: "ROI Promedio", val: "+240%", icon: BarChart3 }
              ].map((p, i) => (
                  <div key={i} className="space-y-4 border-l border-white/5 pl-8">
                      <p.icon className="text-[#ecb613]/40" size={24} />
                      <div>
                          <h3 className="text-4xl font-black text-white tracking-tighter">{p.val}</h3>
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{p.label}</p>
                      </div>
                  </div>
              ))}
          </section>

          {/* SERVICIOS DISPONIBLES EN LA PROVINCIA */}
          <section id="servicios" className="px-6 max-w-7xl mx-auto space-y-16">
              <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Servicios Disponibles en <span className="text-[#ecb613]">{provinceTitle}</span></h2>
                  <div className="h-1 w-20 bg-[#ecb613]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {SERVICIOS.map((s, i) => (
                      <Link 
                          key={i} 
                          href={`/${rootPrefix}/${s.slug}`}
                          className="group p-10 rounded-[2.5rem] border border-white/5 bg-zinc-950/50 hover:border-[#ecb613]/30 transition-all duration-500 relative overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                              <Zap className="w-32 h-32 text-[#ecb613]" />
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-[#ecb613] transition-colors">{s.nombre}</h3>
                          <p className="text-sm text-white/40 leading-relaxed font-light mb-8">{s.descripcion}</p>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#ecb613] opacity-0 group-hover:opacity-100 transition-opacity">
                              Ver Ficha Técnica <ArrowRight size={12} />
                          </div>
                      </Link>
                  ))}
              </div>
          </section>

          {/* DEMAND ENGINE */}
          <section className="px-6 max-w-7xl mx-auto space-y-12">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/20 whitespace-nowrap">Matriz de Demanda Territorial</h2>
              <div className="h-[1px] w-full bg-white/5" />
            </div>
            <div className="rounded-[4rem] overflow-hidden border border-white/5 shadow-3xl">
              <DemandEngine />
            </div>
          </section>
        </main>

        <footer className="py-20 border-t border-white/5 bg-black px-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-black tracking-tighter">
              EAR<span className="text-[#ecb613]">OS</span>
            </div>
            <p className="text-[10px] tracking-[0.5em] text-white/10 uppercase font-black">
              © 2026 PRODUCTORA EAR • {provinceTitle.toUpperCase()} REGIONAL HUB
            </p>
        </footer>
      </div>
    );
  }

  // 3. CASO B: SERVICIO EN PROVINCIA (Ej: /madrid/sonorizacion-eventos, /valencia/dj-premium)
  if (slug.length === 2 && isProvincia) {
    const province = rootPrefix;
    const serviceSlug = slug[1];
    const service = SERVICIOS.find(s => s.slug === serviceSlug) || {
      id: serviceSlug,
      slug: serviceSlug,
      nombre: formatTitle([serviceSlug]),
      descripcion: `Ingeniería de sonido y protocolo de actuación en ${serviceSlug.replace(/-/g, ' ')} para ${formatTitle([province])}.`,
      keywords: [serviceSlug, province, 'productora ear', 'eventos s-class']
    };

    return (
      <BespokeTemplate 
        title={`${service.nombre} en ${formatTitle([province])}`}
        description={service.descripcion}
        location={province}
        serviceId={service.id}
        keywords={service.keywords}
        isApex={true}
      />
    );
  }

  // 4. CASO C: VERTICALES PROGRAMÁTICAS (/weddings/..., /production/..., /tools/..., /arsenal/..., /artistas/..., /titan/...)
  if (PROGRAMMATIC_VERTICALS.has(rootPrefix) && slug.length >= 2) {
    const itemSlug = slug[slug.length - 1];
    const itemTitle = formatTitle([itemSlug]);
    const verticalCategory = rootPrefix.toUpperCase();

    const matchedProvince = PROVINCIAS.find(p => itemSlug.endsWith(`-${p}`)) || 'madrid';
    const locationName = formatTitle([matchedProvince]);

    return (
      <BespokeTemplate 
        title={`${itemTitle} (${verticalCategory})`}
        description={`Protocolo de contratación S-Class y ejecución técnica para ${itemTitle}. Despliegue garantizado en ${locationName} y cobertura nacional.`}
        location={locationName}
        serviceId={slug.join('_')}
        keywords={[itemTitle, rootPrefix, 'Productora EAR', 'S-Class']}
        isApex={true}
      />
    );
  }

  // 5. CUALQUIER OTRA COMBINACIÓN NO AUTORIZADA -> 404
  notFound();
}

// 🚀 PERMITIR RENDERIZADO DINÁMICO EN EL EDGE PARA CUALQUIER COMBINACIÓN DE SITEMAP
export const dynamicParams = true;

export async function generateStaticParams() {
  const allParams: { slug: string[] }[] = [];

  // Provincias principales
  PROVINCIAS.slice(0, 52).forEach(p => {
    allParams.push({ slug: [p] });
  });

  // Servicios top en las 5 provincias estratégicas
  const topProvinces = ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga'];
  topProvinces.forEach(p => {
    SERVICIOS.forEach(s => {
      allParams.push({ slug: [p, s.slug] });
    });
  });

  return allParams;
}
