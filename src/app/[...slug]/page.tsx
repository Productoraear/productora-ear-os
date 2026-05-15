import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/components/SClassScreens/BespokeTemplate';
import { DemandEngine } from '@/modules/SClassScreens/DemandEngine';
import { Rocket, MapPin, ShieldCheck, Zap, ArrowRight, Target, Cpu, Globe, Activity, Star, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';
import { FEATURED_ARTISTS } from '@/data/artists';
import { ROUTES } from '@/lib/routes';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * 🛠️ UTILIDAD DE FORMATEO (VAMPIRE ENGINE OMEGA)
 */
function formatTitle(slugArray: string[]) {
  const lastSegment = slugArray[slugArray.length - 1];
  return lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace('Ear', 'EAR')
    .replace('Ai', 'IA');
}

/**
 * 🛰️ METADATOS DINÁMICOS (AEO/SEO OMEGA)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = formatTitle(slug);
  const fullPath = slug.join(' / ').toUpperCase();

  return {
    title: `${title} | VIMUME OS Institutional`,
    description: `Infraestructura de autoridad y protocolos institucionales para ${title}. Gestión de programas de impacto y producción de alto nivel en toda España.`,
    keywords: [...slug, 'vimume os', 'productora ear', 'impacto social', 'autoridad institucional'],
    openGraph: {
      title: `${title} - VIMUME OS Authority`,
      description: `Protocolos de excelencia: ${fullPath}. Arquitectura narrativa para el sector público y privado.`,
      images: ['/og-image-vimume.jpg'],
    }
  };
}

/**
 * 🏆 ENRUTADOR UNIVERSAL OMEGA (S-CLASS)
 * Factory Pattern de Renderizado para >2,100 landings.
 */
export default async function UniversalOmegaPage({ params }: PageProps) {
  const { slug } = await params;
  const title = formatTitle(slug);
  const section = slug[0];

  // 🧪 LÓGICA DE FACTORÍA (S-CLASS RENDERER)
  const isProvincia = PROVINCIAS.includes(slug[0]);
  const isServicio = slug.length === 2 && isProvincia && SERVICIOS.some(s => s.slug === slug[1]);

  // CATEGORÍAS ESPECIALES (S-CLASS VERTICALS)
  const isArsenal = slug[0] === 'arsenal' || slug[0] === 'arsenal-forense';
  const isWeddings = slug[0] === 'weddings' || slug[0] === 'bodas' || slug[0] === 'wedding-planners';
  const isBusiness = slug[0] === 'business' || slug[0] === 'empresarios' || slug[0] === 'ayuntamientos-premium';

  if (isServicio) {
    const province = slug[0];
    const serviceBase = SERVICIOS.find(s => s.slug === slug[1]);
    
    const service = serviceBase || {
      id: slug[1],
      slug: slug[1],
      nombre: slug[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      descripcion: `Excelencia técnica en ${slug[1].replace(/-/g, ' ')} para la provincia de ${province}.`,
      keywords: [slug[1], province, 'productora ear', 'eventos premium']
    };
    
    const isApexRoute = 
      service.id.includes('premium') || 
      service.id.includes('bespoke') || 
      service.slug.includes('boda') ||
      service.slug.includes('wedding') ||
      slug[1].includes('boda');

    return (
      <BespokeTemplate 
        title={service.nombre}
        description={service.descripcion}
        location={province}
        serviceId={service.id}
        keywords={service.keywords}
        isApex={isApexRoute}
      />
    );
  }

  // Renderizado para Ítems del Arsenal o Bodas (Deep Landing)
  if (slug.length >= 2 && (isArsenal || isWeddings || isBusiness)) {
      const itemTitle = slug[slug.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const category = slug[0].toUpperCase();
      
      return (
        <BespokeTemplate 
          title={itemTitle}
          description={`Protocolo de actuación institucional para ${itemTitle}. Autoridad técnica y soporte VIMUME OS certificado.`}
          location="España"
          serviceId={slug.join('_')}
          keywords={[itemTitle, slug[0], 'VIMUME OS', 'Autoridad']}
          isApex={true}
        />
      );
  }

  // Renderizado de Landing de Provincia o Categoría (S-Class Sales View)
  const isCategory = isArsenal || isWeddings || isBusiness || ['artistas', 'eventos', 'journal'].includes(slug[0]);
  const viewTitle = isCategory ? title : `DOMINANCIA EN ${title.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 selection:text-white font-inter">
      {/* NAVEGACIÓN BLINDADA */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-3xl py-5 px-10 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="text-2xl font-black tracking-tighter hover:text-[#ecb613] transition-all uppercase">
          VIMUME<span className="text-[#ecb613]">OS</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-[10px] uppercase font-black tracking-[0.3em] text-white/40">
          <Link href="/artistas" className="hover:text-[#ecb613] transition-colors">Artistas</Link>
          <Link href="/eventos" className="hover:text-[#ecb613] transition-colors">Producción</Link>
          <Link href={ROUTES.contacto} className="bg-[#ecb613] text-black px-6 py-2.5 rounded-full hover:scale-105 transition-transform">Contacto</Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 space-y-32">
        {/* HERO SALES - IMPACTO S-CLASS */}
        <section className="relative px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ecb613]/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-[#ecb613]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                {isCategory ? 'Módulo Institucional' : 'Presencia Territorial'} • {title}
              </span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase max-w-5xl">
                {isCategory ? (
                    <>
                        {title.split(' ')[0]} <br/>
                        <span className="text-[#ecb613] italic">{title.split(' ').slice(1).join(' ')}</span>
                    </>
                ) : (
                    <>
                        AUTORIDAD <br/>
                        <span className="text-[#ecb613] italic">INSTITUCIONAL</span> <br/>
                        EN {title}
                    </>
                )}
            </h1>

            <p className="text-xl md:text-3xl text-white/50 max-w-4xl leading-tight font-light italic">
              {isCategory ? (
                  `Protocolos de impacto y gestión avanzada para la vertical de ${title}. Optimizando cada nodo de servicio.`
              ) : (
                  `"No solo gestionamos proyectos en ${title}. Garantizamos la excelencia operativa mediante el despliegue de protocolos de alta autoridad."`
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-10">
              <Link 
                href="/admin/configurador"
                className="bg-[#ecb613] text-black px-16 py-7 rounded-2xl font-black uppercase text-xs tracking-[0.4em] shadow-[0_20px_50px_rgba(212,168,85,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-4"
              >
                RESERVAR PROYECTO <Zap className="w-5 h-5" />
              </Link>
              <Link 
                href="#servicios"
                className="bg-white/5 border border-white/10 text-white px-16 py-7 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-4 backdrop-blur-xl"
              >
                CATÁLOGO LOCAL <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* PROOF - SOCIAL & TECHNICAL */}
        <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
                { label: "Impacto en " + title, val: "500+", icon: Star },
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

        {/* CONTENIDO ESPECÍFICO (SOLO PARA PROVINCIAS O CATEGORÍAS) */}
        {!isCategory ? (
            <section id="servicios" className="px-6 max-w-7xl mx-auto space-y-16">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Servicios <span className="text-[#ecb613]">Disponibles</span></h2>
                    <div className="h-1 w-20 bg-[#ecb613]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SERVICIOS.map((s, i) => (
                        <Link 
                            key={i} 
                            href={`/${slug[0]}/${s.slug}`}
                            className="group p-10 rounded-[2.5rem] border border-white/5 bg-zinc-950/50 hover:border-[#ecb613]/30 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <Zap className="w-32 h-32 text-[#ecb613]" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-[#ecb613] transition-colors">{s.nombre}</h3>
                            <p className="text-sm text-white/40 leading-relaxed font-light mb-8">{s.descripcion}</p>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#ecb613] opacity-0 group-hover:opacity-100 transition-opacity">
                                Ver Detalles <ArrowRight size={12} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        ) : slug[0] === 'artistas' && (
            <section id="servicios" className="px-6 max-w-7xl mx-auto space-y-24">
                {/* 👑 MASTER ARTIST SPOTLIGHT (PACIENTE CERO) */}
                {FEATURED_ARTISTS.filter(a => a.isStrategicFocus).map((ceo, i) => (
                    <div key={i} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#ecb613] to-transparent opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-950/80 border border-[#ecb613]/20 rounded-[4rem] p-12 overflow-hidden">
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                                <img src={ceo.image} alt={ceo.name} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000" />
                            </div>
                            <div className="flex flex-col justify-center space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-4 py-1.5 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-black tracking-widest uppercase border border-[#ecb613]/30">
                                            {ceo.status}
                                        </span>
                                        <Globe className="text-white/20" size={16} />
                                    </div>
                                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">
                                        {ceo.name}
                                    </h2>
                                    <p className="text-[#ecb613] font-bold tracking-[0.3em] uppercase text-xs italic">
                                        {ceo.genre}
                                    </p>
                                </div>
                                
                                <p className="text-xl text-white/60 leading-relaxed font-light italic">
                                    "{ceo.desc}"
                                </p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Roles</span>
                                        <div className="flex flex-wrap gap-2">
                                            {ceo.roles?.map((r, ri) => (
                                                <span key={ri} className="text-[10px] font-bold text-white/40">/ {r}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Location</span>
                                        <p className="text-xs font-bold text-white/40">{ceo.location}</p>
                                    </div>
                                </div>

                                <button className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase text-xs tracking-[0.5em] hover:bg-[#ecb613] hover:text-black transition-all">
                                    SOLICITAR COLABORACIÓN
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 🎵 OTROS ARTISTAS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {FEATURED_ARTISTS.filter(a => !a.isStrategicFocus).map((artist, i) => (
                        <div key={i} className="group space-y-6">
                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 grayscale hover:grayscale-0 transition-all">
                                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[#ecb613] transition-colors">{artist.name}</h3>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{artist.genre}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* DEMAND ENGINE INTEGRATION */}
        <section className="px-6 max-w-7xl mx-auto space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/20 whitespace-nowrap">Matriz de Demanda Institucional</h2>
            <div className="h-[1px] w-full bg-white/5" />
          </div>
          <div className="rounded-[4rem] overflow-hidden border border-white/5 shadow-3xl">
            <DemandEngine />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#ecb613] py-32 px-6 text-black text-center space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                LÍDERES EN <br/> {title.toUpperCase()}
            </h2>
            <p className="text-xl font-bold uppercase tracking-widest max-w-2xl mx-auto opacity-70">
                ¿Su proyecto exige un estándar inalcanzable para la competencia?
            </p>
            <Link 
                href="/admin/configurador"
                className="inline-block bg-black text-[#ecb613] px-20 py-8 rounded-2xl font-black uppercase text-sm tracking-[0.5em] hover:scale-105 transition-all shadow-2xl"
            >
                ACTIVAR PROYECTO
            </Link>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black tracking-tighter">
            VIMUME<span className="text-[#ecb613]">OS</span>
          </div>
          <p className="text-[10px] tracking-[0.5em] text-white/10 uppercase font-black">
            © 2026 VIMUME OS • INSTITUTIONAL INFRASTRUCTURE • {title.toUpperCase()} HUB
          </p>
      </footer>
    </div>
  );
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'urls_sitemap.json');
  const allParams: { slug: string[] }[] = [];

  PROVINCIAS.forEach(p => {
    allParams.push({ slug: [p] });
  });

  PROVINCIAS.forEach(p => {
    SERVICIOS.forEach(s => {
      allParams.push({ slug: [p, s.slug] });
    });
  });

  const criticalRoutes = ['artistas', 'bodas', 'eventos', 'new', 'empresarios', 'arsenal', 'weddings', 'business', 'journal', 'social'];
  criticalRoutes.forEach(route => {
    allParams.push({ slug: [route] });
  });

  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const urls: string[] = JSON.parse(fileContent);
      
      urls.forEach(url => {
        try {
          const pathname = new URL(url).pathname;
          const isCore = pathname === '/' || pathname.includes('admin') || pathname.includes('api') || pathname.includes('login') || pathname.includes('centro-mando') || pathname.includes('arsenal');
          
          if (!isCore) {
            const pathArray = pathname.split('/').filter(Boolean);
            const exists = allParams.some(p => p.slug.join('/') === pathArray.join('/'));
            if (!exists && pathArray.length > 0) {
              allParams.push({ slug: pathArray });
            }
          }
        } catch (e) {}
      });
    }
  } catch (error) {
    console.error("Error en generateStaticParams (Universal):", error);
  }

  return allParams;
}
