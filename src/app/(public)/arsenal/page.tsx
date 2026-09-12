import React from 'react';
import { Metadata } from 'next';
import ArsenalTecnicoView from '@/features/arsenal/ui/ArsenalTecnicoView';
import { SplineHeroSClass } from '@/components/ui/SplineHeroSClass';

export const metadata: Metadata = {
  title: 'El Arsenal Técnico | Infraestructura y Equipos Audiovisuales S-Class',
  description: 'Alquiler de Pantallas LED P2.9 Novastar, Monitores 4K, Sonido Line Array VTX A8, Iluminación y Escenarios en Madrid y toda España bajo el dominio productoraear.com.',
  alternates: {
    canonical: 'https://productoraear.com/arsenal',
  }
};

export default function ArsenalPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <SplineHeroSClass
        title="Arsenal Audiovisual"
        subtitle="3D & Hardware de Élite"
        description="Pantallas LED P2.9 Novastar HDR de alto brillo, procesado 4K, sonido Line Array d&b / Bose F1 a 12 W/pax y microfonía inalámbrica Shure Axient con técnico in situ."
        primaryCtaText="Calcular Presupuesto"
        primaryCtaLink="/cotizador"
        secondaryCtaText="Consultar por WhatsApp"
        secondaryCtaLink="https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20deseo%20consultar%20disponibilidad%20del%20Arsenal%20Audiovisual%20LED%20y%20Sonido."
      />
      <div className="max-w-[1280px] mx-auto px-4 space-y-16">
        <ArsenalTecnicoView />

        {/* HUB TERRITORIAL DE ARSENAL POR POBLACIONES */}
        <section className="border-t border-white/10 pt-16 pb-12">
          <div className="space-y-4 mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-widest uppercase">
              COBERTURA TERRITORIAL S-CLASS
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Alquiler de Arsenal en <span className="text-[#ecb613]">cada Población</span>
            </h2>
            <p className="text-slate-400 max-w-3xl text-sm md:text-base leading-relaxed">
              Cada municipio dispone de inventario audiovisual específico, cálculo acústico calibrado a 12 W/pax, limitación sonora legal y tiempos de tránsito express desde nuestra base logística en Méntrida (Toledo) y hubs de la península.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Méntrida (Base Central)', prov: 'Toledo', slug: 'mentrida', badge: 'ZONA CERO', km: '0 km / Base', road: 'Base Méntrida' },
              { name: 'Madrid Capital', prov: 'Madrid', slug: 'madrid', badge: 'METRÓPOLIS', km: '54 km • 42 min', road: 'A-5 / M-30' },
              { name: 'Toledo', prov: 'Toledo', slug: 'toledo', badge: 'ZONA CERO', km: '48 km • 35 min', road: 'A-42' },
              { name: 'Alcorcón', prov: 'Madrid', slug: 'alcorcon', badge: 'CORONA SUR', km: '41 km • 30 min', road: 'A-5 directo' },
              { name: 'Móstoles', prov: 'Madrid', slug: 'mostoles', badge: 'CORONA SUR', km: '38 km • 28 min', road: 'A-5 / M-506' },
              { name: 'Illescas', prov: 'Toledo', slug: 'illescas', badge: 'ZONA CERO', km: '32 km • 25 min', road: 'CM-4010' },
              { name: 'Las Rozas', prov: 'Madrid', slug: 'las-rozas', badge: 'CORONA NOROESTE', km: '49 km • 38 min', road: 'A-6 / M-50' },
              { name: 'Pozuelo de Alarcón', prov: 'Madrid', slug: 'pozuelo-de-alarcon', badge: 'CORONA NOROESTE', km: '45 km • 35 min', road: 'M-503 / M-50' },
              { name: 'El Escorial', prov: 'Madrid', slug: 'el-escorial', badge: 'FINCAS DESTINO', km: '58 km • 45 min', road: 'M-505 / A-6' },
              { name: 'Chinchón', prov: 'Madrid', slug: 'chinchon', badge: 'HISTÓRICA', km: '82 km • 65 min', road: 'A-4 / M-404' },
              { name: 'Talavera de la Reina', prov: 'Toledo', slug: 'talavera-de-la-reina', badge: 'ZONA CERO', km: '68 km • 48 min', road: 'Autovía A-5' },
              { name: 'Torrijos', prov: 'Toledo', slug: 'torrijos', badge: 'ZONA CERO', km: '29 km • 22 min', road: 'A-40' },
              { name: 'Alcalá de Henares', prov: 'Madrid', slug: 'alcala-de-henares', badge: 'CORONA ESTE', km: '78 km • 58 min', road: 'A-2 / M-50' },
              { name: 'Getafe', prov: 'Madrid', slug: 'getafe', badge: 'CORONA SUR', km: '46 km • 34 min', road: 'A-42' },
              { name: 'Barcelona', prov: 'Barcelona', slug: 'barcelona', badge: 'HUB CATALUÑA', km: '640 km / Red Express', road: 'AP-7 / A-2' },
              { name: 'Valencia', prov: 'Valencia', slug: 'valencia', badge: 'HUB LEVANTE', km: '390 km / Red Express', road: 'A-3' },
              { name: 'Sevilla', prov: 'Sevilla', slug: 'sevilla', badge: 'HUB ANDALUCÍA', km: '510 km / Red Express', road: 'A-4' },
              { name: 'Zaragoza', prov: 'Zaragoza', slug: 'zaragoza', badge: 'HUB ARAGÓN', km: '365 km / Red Express', road: 'A-2' },
              { name: 'Segovia', prov: 'Segovia', slug: 'segovia', badge: 'VILLAS DESTINO', km: '110 km • 75 min', road: 'AP-61 / AP-6' },
              { name: 'Ávila', prov: 'Ávila', slug: 'avila', badge: 'VILLAS DESTINO', km: '95 km • 65 min', road: 'N-403 / AP-51' },
            ].map((town) => (
              <a
                key={town.slug}
                href={`/alquiler/${town.slug}`}
                className="group block p-4 bg-zinc-950/80 hover:bg-zinc-900 border border-white/5 hover:border-[#ecb613]/40 rounded-2xl transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded">
                    {town.badge}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {town.road}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#ecb613] transition-colors">
                  {town.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Provincia de {town.prov} • <span className="text-slate-300 font-mono">{town.km}</span>
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#ecb613] font-medium group-hover:translate-x-1 transition-transform">
                  <span>Ver Arsenal Local</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

