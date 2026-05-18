import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Mic2, Star, ShieldCheck, Heart, Users, Disc, 
  ChevronRight, Sparkles, Trophy, Music, Calendar, 
  ArrowRight, Volume2, Shield 
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';
import PublicNavbar from '@/app/components/public/PublicNavbar';

export const metadata: Metadata = {
  title: 'Contratar Cantantes Solistas S-Class | Productora EAR',
  description: 'Contrata solistas premium de mariachi y ranchera tradicional. Edwin Agudelo, solista insignia de gala. Equipamiento Bose de alta fidelidad y directos sin intermediarios.',
  alternates: {
    canonical: 'https://productoraear.com/artistas/solistas',
  }
};

export default function SolistasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "Cantantes Solistas Premium S-Class",
    "description": "Portafolio oficial de cantantes solistas del ecosistema Productora EAR, con Edwin Agudelo como artista insignia.",
    "url": "https://productoraear.com/artistas/solistas",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Edwin Agudelo - Solista Premium",
          "url": "https://productoraear.com/artistas/edwin-agudelo"
        }
      ]
    }
  };

  const localizedSolistas = [
    {
      slug: "mariachi-bodas-madrid-solista",
      title: "Solista para Bodas en Madrid",
      location: "Madrid",
      desc: "Experiencia de gala nupcial íntima y distinguida con ecualización de Bose.",
      icon: <Heart className="text-red-400" size={24} />
    },
    {
      slug: "mariachi-cumpleanos-malaga-solista",
      title: "Serenatas de Cumpleaños en Málaga",
      location: "Málaga",
      desc: "Regalo emotivo con las mañanitas tradicionales a domicilio o restaurante.",
      icon: <Sparkles className="text-amber-400" size={24} />
    },
    {
      slug: "mariachi-bodas-oro-alicante-solista",
      title: "Aniversarios & Bodas de Oro en Alicante",
      location: "Alicante",
      desc: "Homenaje musical premium para 25 y 50 aniversarios de boda.",
      icon: <Trophy className="text-[#ecb613]" size={24} />
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pt-40 pb-24 font-sans selection:bg-[#ecb613]/30 overflow-hidden">
      <PublicNavbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-foreground/[0.01] blur-[120px] rounded-full pointer-events-none -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 font-mono">
              <Mic2 size={12} /> Ingeniería de Talento V2
            </span>
            <span className="text-muted-foreground text-[9px] font-black uppercase tracking-widest font-mono">
              SOVEREIGN SOLISTAS
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-foreground font-syne">
            Cantantes <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-foreground/80">Solistas</span> S-Class
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto">
            La pureza acústica y la potencia escénica del mariachi de etiqueta. Edwin Agudelo y nuestra curaduría artística redefinen la amenización íntima sin intermediarios.
          </p>
        </section>

        {/* FLAGSHIP SPOTLIGHT CARD: EDWIN AGUDELO */}
        <section className="bg-card border border-border rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#ecb613]/5 blur-[120px] rounded-full group-hover:bg-[#ecb613]/10 transition-all duration-700 pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Bio & Spotlight info */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono">
                  Artista Insignia
                </span>
                <span className="text-muted-foreground text-[9px] font-black uppercase tracking-widest font-mono">
                  +20 AÑOS DE TRAYECTORIA
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] font-syne text-foreground">
                Edwin <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-foreground">Agudelo</span>
              </h2>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Nacido en Colombia y forjado artísticamente con rigor y pasión, Edwin Agudelo representa el estándar de oro en el mariachi solista en España. Con su himno principal <strong>"Acompáñame"</strong> y un repertorio meticulosamente diseñado para provocar la máxima emoción, garantiza una ecualización impecable apoyada por sistemas Bose L1, ideal para recepciones de alta alcurnia, ceremonias y celebraciones selectas.
              </p>

              {/* High value specialized intent links */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Formatos Especializados de Edwin:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {localizedSolistas.map((item, idx) => (
                    <Link 
                      key={idx} 
                      href={`/artistas/${item.slug}`} 
                      className="p-4 bg-muted/20 border border-border hover:border-[#ecb613]/30 rounded-2xl flex flex-col justify-between transition-all group/link hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-muted rounded-xl text-foreground/60">
                          {item.icon}
                        </div>
                        <span className="text-[8px] font-mono font-black text-muted-foreground uppercase">{item.location}</span>
                      </div>
                      <div>
                        <h5 className="text-[11px] font-black uppercase tracking-tight text-foreground group-hover/link:text-[#ecb613] transition-colors mb-1">{item.title}</h5>
                        <p className="text-[9px] text-muted-foreground leading-tight italic">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/artistas/edwin-agudelo"
                  className="px-8 py-4 bg-foreground text-background hover:bg-[#ecb613] hover:text-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Ver Dossier de Autoridad
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/contacto?subject=Reserva+Edwin+Agudelo+Solista"
                  className="px-8 py-4 bg-muted border border-border hover:border-[#ecb613]/30 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-foreground transition-all text-center"
                >
                  Bloquear Fecha al Instante
                </Link>
              </div>
            </div>

            {/* Right: Technical specifications box */}
            <div className="lg:col-span-5 bg-background border border-border rounded-[2.5rem] p-8 md:p-10 space-y-6">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-[#ecb613]">
                <Trophy size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-syne text-foreground">Ficha de Calidad S-Class</h3>
              
              <div className="space-y-4 border-t border-border pt-4">
                {[
                  { label: "Equipamiento Técnico", value: "Bose L1 PRO Columnas Auto-alimentadas" },
                  { label: "Repertorio Sugerido", value: "Las Mañanitas, Amor Eterno, Motivos" },
                  { label: "Formatos Disponibles", value: "Pistas Premium / Guitarra de Acompañamiento" },
                  { label: "Tiempo del Directo", value: "Hasta 90 minutos de pura emoción" },
                  { label: "Rider Logístico", value: "Autónomo. Sin necesidad de acometidas complejas" }
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-bold text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </section>

        {/* PRICE MATRIX AND GUARANTEES */}
        <section className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Optimización B2B sin intermediarios</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne text-foreground">Tarifas y Transparencia</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              El Nexo EAR OS garantiza tarifas directas de artista, certificando que el 100% de tu inversión se destine al arte, el sonido y la elegancia técnica del show.
            </p>
          </div>

          <ArtistPricingMatrix />
        </section>

        {/* EVIDENCIA Y TESTIMONIOS */}
        <ArtistTestimonials />

        {/* SYSTEM CROSS-NAVIGABILITY (PREVENTS DEAD ENDS) */}
        <section className="border-t border-border pt-20">
          <div className="bg-card rounded-[3rem] border border-border p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] font-mono">
                Ecosistema EAR OS
              </span>
              <h3 className="text-3xl font-black uppercase italic tracking-tight font-syne text-foreground">
                ¿Buscas otros formatos?
              </h3>
              <p className="text-muted-foreground text-sm">
                Explora el catálogo de curaduría de la Academia Diamante Rojo para ensambles de gran escala, orquestas de gala y shows técnicos.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link 
                href="/artistas"
                className="px-8 py-5 bg-muted hover:bg-foreground text-foreground hover:text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all flex items-center justify-center gap-2 group"
              >
                Volver a Talento
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contacto"
                className="px-8 py-5 bg-[#ecb613] hover:bg-[#ecb613]/90 text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all shadow-[0_15px_30px_rgba(236,182,19,0.15)]"
              >
                Consultar Viabilidad Directa
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
