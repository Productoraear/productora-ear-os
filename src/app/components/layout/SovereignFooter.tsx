import Link from 'next/link';

export default function SovereignFooter() {
  const provinces = [
    { name: 'Madrid', slug: 'madrid' },
    { name: 'Barcelona', slug: 'barcelona' },
    { name: 'Valencia', slug: 'valencia' },
    { name: 'Sevilla', slug: 'sevilla' },
    { name: 'Zaragoza', slug: 'zaragoza' },
    { name: 'Málaga', slug: 'malaga' },
    { name: 'Murcia', slug: 'murcia' },
    { name: 'Palma', slug: 'baleares' },
    { name: 'Las Palmas', slug: 'las-palmas' },
    { name: 'Bilbao', slug: 'vizcaya' },
    { name: 'Alicante', slug: 'alicante' },
    { name: 'Córdoba', slug: 'cordoba' },
    { name: 'Valladolid', slug: 'valladolid' },
    { name: 'Vigo', slug: 'pontevedra' },
    { name: 'Gijón', slug: 'asturias' },
    { name: 'Granada', slug: 'granada' },
    { name: 'Vitoria', slug: 'alava' },
    { name: 'A Coruña', slug: 'a-coruna' },
    { name: 'Elche', slug: 'alicante' },
    { name: 'Oviedo', slug: 'asturias' },
    { name: 'Badalona', slug: 'barcelona' },
    { name: 'Terrassa', slug: 'barcelona' },
    { name: 'Cartagena', slug: 'murcia' },
    { name: 'Sabadell', slug: 'barcelona' }
  ];

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <div className="space-y-4">
          <h3 className="text-xl font-fraunces font-black text-white uppercase">Productora EAR</h3>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Diseño, producción y ejecución de eventos de alto impacto. Desde celebraciones privadas hasta licitaciones institucionales y alquiler de equipamiento audiovisual profesional.
          </p>
          <div className="text-[#ecb613] font-mono text-sm pt-4 border-t border-white/10 inline-block">
            Atención Directa: +34 693 693 048
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase text-sm mb-4 tracking-wider">Servicios</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li><Link href="/bodas" className="hover:text-white transition-colors">Bodas & Particulares</Link></li>
            <li><Link href="/alquiler-equipos-sonido-audiovisuales" className="hover:text-white transition-colors">Alquiler de Audiovisuales</Link></li>
            <li><Link href="/ocasiones/ayuntamientos" className="hover:text-white transition-colors">Fiestas Patronales & Ayuntamientos</Link></li>
            <li><Link href="/catering-brasas" className="hover:text-white transition-colors">Catering & Brasas</Link></li>
            <li><Link href="/vimume" className="hover:text-white transition-colors">Proyecto Vimume</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase text-sm mb-4 tracking-wider">Red Territorial de Cobertura</h4>
          <div className="grid grid-cols-3 gap-2">
            {provinces.map((prov) => (
              <Link 
                key={prov.name} 
                href={`/bodas/${prov.slug}/eventos`}
                className="text-xs text-white/40 hover:text-white transition-colors truncate"
              >
                {prov.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
