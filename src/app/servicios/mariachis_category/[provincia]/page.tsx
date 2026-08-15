import { notFound } from 'next/navigation';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA } from '@/lib/phone-constants';
import { LocalBusinessSchema } from '@/app/components/seo/LocalBusinessSchema';

/**
 * 📍 PROVINCIAL LANDING — SEO LOCAL + CLICK-TO-CALL
 * Each province gets a dedicated page with dual CTA (call + WhatsApp)
 * and LocalBusiness Schema injection for Google rich results.
 */

const PROVINCIAS_VALIDAS = [
  "alava", "albacete", "alicante", "almeria", "asturias", "avila", "badajoz",
  "baleares", "barcelona", "burgos", "caceres", "cadiz", "cantabria", "castellon",
  "ciudad-real", "cordoba", "cuenca", "gerona", "granada", "guadalajara",
  "guipuzcoa", "huelva", "huesca", "jaen", "leon", "lerida", "lugo", "madrid",
  "malaga", "murcia", "navarra", "orense", "palencia", "las-palmas", "pontevedra",
  "la-rioja", "salamanca", "segovia", "sevilla", "soria", "tarragona", "tenerife",
  "teruel", "toledo", "valencia", "valladolid", "vizcaya", "zamora", "zaragoza"
];

function capitalizeProvince(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default async function ProvincePage(props: { params: Promise<{ provincia: string }> }) {
  const params = await props.params;
  const { provincia } = params;

  if (!PROVINCIAS_VALIDAS.includes(provincia.toLowerCase())) {
    notFound();
  }

  const displayName = capitalizeProvince(provincia);

  return (
    <main className="bg-[#050505] text-white min-h-screen">
      <LocalBusinessSchema city={displayName} serviceName={`Mariachis en ${displayName}`} serviceDesc={`Contratación directa de mariachis profesionales verificados en ${displayName}. Edwin Agudelo y su ensamble de gala disponibles para bodas, cumpleaños, serenatas y eventos corporativos.`} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-block px-5 py-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613] text-[10px] font-black tracking-[0.5em] uppercase">
            Cobertura Verificada
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] font-syne">
            Mariachis en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white">{displayName}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Contratación directa de artistas verificados por Productora EAR en la provincia de {displayName}. 
            Servicio premium con logística completa, ingeniería sónica y protocolo institucional.
          </p>
        </div>
      </section>

      {/* CTA DUAL: Call + WhatsApp */}
      <section className="pb-20 px-6">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-stretch gap-4">
          <a
            href={CENTRALITA.tel}
            className="flex-1 flex items-center justify-center gap-3 bg-[#ecb613] text-black font-black text-base uppercase tracking-wider rounded-2xl py-5 px-8 transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(236,182,19,0.4)] active:scale-95"
            aria-label={`Llamar al ${CENTRALITA.display}`}
          >
            <Phone size={22} strokeWidth={2.5} />
            <span>Llamar: {CENTRALITA.display}</span>
          </a>

          <a
            href={`${CENTRALITA.whatsapp}?text=${encodeURIComponent(`Hola, me interesa contratar mariachis en ${displayName}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-black text-sm uppercase tracking-wider rounded-2xl py-5 px-8 transition-all hover:bg-[#25D366]/20 active:scale-95"
          >
            <MessageCircle size={18} strokeWidth={2.5} />
            <span>WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Interlink to Edwin pillar */}
      <section className="pb-32 px-6 border-t border-white/5 pt-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-white/40 text-sm uppercase font-black tracking-widest">Artista Principal</p>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase font-syne">
            Edwin Agudelo
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Tenor lírico y mariachi profesional de gala con más de 37 conciertos internacionales. 
            Disponible para eventos en {displayName} con logística completa de Productora EAR.
          </p>
          <Link
            href="/artistas/edwin-agudelo"
            className="inline-flex items-center gap-2 text-[#ecb613] font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
          >
            Ver Perfil Completo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
