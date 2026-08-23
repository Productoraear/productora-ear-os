'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, MapPin, ChevronRight, ChevronLeft, Sparkles, Building2,
  Camera, Music, Car, Bus, Layers, Tent, Flower2, 
  Gift, Heart, Utensils, Award, X, Check, ShieldCheck, 
  PartyPopper, Cake, Compass, Crown
} from 'lucide-react';

interface ZoneItem {
  name: string;
  count: number;
  image: string;
  slug: string;
}

const ZONES_LIST: ZoneItem[] = [
  {
    name: 'Madrid',
    count: 419,
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=400&auto=format&fit=crop',
    slug: 'madrid'
  },
  {
    name: 'Barcelona',
    count: 524,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=400&auto=format&fit=crop',
    slug: 'barcelona'
  },
  {
    name: 'Valencia',
    count: 235,
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=400&auto=format&fit=crop',
    slug: 'valencia'
  },
  {
    name: 'Sevilla',
    count: 237,
    image: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?q=80&w=400&auto=format&fit=crop',
    slug: 'sevilla'
  },
  {
    name: 'Málaga',
    count: 290,
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=400&auto=format&fit=crop',
    slug: 'malaga'
  },
  {
    name: 'Toledo',
    count: 185,
    image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=400&auto=format&fit=crop',
    slug: 'toledo'
  },
  {
    name: 'Murcia',
    count: 162,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop',
    slug: 'murcia'
  },
  {
    name: 'Granada',
    count: 126,
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=400&auto=format&fit=crop',
    slug: 'granada'
  },
  {
    name: 'Zaragoza',
    count: 75,
    image: 'https://images.unsplash.com/photo-1628172902347-19cb98ec5613?q=80&w=400&auto=format&fit=crop',
    slug: 'zaragoza'
  },
  {
    name: 'Alicante',
    count: 289,
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=400&auto=format&fit=crop',
    slug: 'alicante'
  },
  {
    name: 'Córdoba',
    count: 108,
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=400&auto=format&fit=crop',
    slug: 'cordoba'
  },
  {
    name: 'Las Palmas',
    count: 134,
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=400&auto=format&fit=crop',
    slug: 'las-palmas'
  },
  {
    name: 'Valladolid',
    count: 60,
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=400&auto=format&fit=crop',
    slug: 'valladolid'
  },
  {
    name: 'A Coruña',
    count: 83,
    image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=400&auto=format&fit=crop',
    slug: 'a-coruna'
  },
  {
    name: 'Cádiz',
    count: 227,
    image: 'https://images.unsplash.com/photo-1579282240050-352db0a14c21?q=80&w=400&auto=format&fit=crop',
    slug: 'cadiz'
  }
];

const PROVINCIAS_ESPANA = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 
  'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 
  'Illes Balears (Ibiza/Mallorca)', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 
  'Madrid', 'Málaga (Marbella)', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 
  'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 
  'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

export default function SmartMarketplaceNav() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationTab, setLocationTab] = useState<'provincia' | 'internacional'>('provincia');

  const categoryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsCategoryDropdownOpen(false);
    setIsLocationDropdownOpen(false);

    const locSlug = selectedLocation.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || 'madrid';
    const termLower = searchTerm.toLowerCase();

    if (termLower.includes('musica') || termLower.includes('dj') || termLower.includes('cantante') || termLower.includes('agudelo')) {
      router.push(`/bodas/${locSlug}-precios-musica-directo`);
    } else if (termLower.includes('finca') || termLower.includes('lugar') || termLower.includes('espacio') || termLower.includes('masia')) {
      router.push(`/bodas/fincas-${locSlug}-sonorizacion-gala`);
    } else if (termLower.includes('chofer') || termLower.includes('coche') || termLower.includes('mercedes') || termLower.includes('vehiculo')) {
      router.push(`/servicios/chofer-vip/${locSlug}`);
    } else if (termLower.includes('luz') || termLower.includes('luces') || termLower.includes('navidad') || termLower.includes('monumental')) {
      router.push(`/arsenal/luces-navidad`);
    } else {
      router.push(`/proveedores?q=${encodeURIComponent(searchTerm)}&provincia=${encodeURIComponent(selectedLocation || 'Madrid')}`);
    }
  };

  const handleSelectCategory = (categoryTitle: string, directUrl?: string) => {
    setSearchTerm(categoryTitle);
    setIsCategoryDropdownOpen(false);
    if (directUrl) {
      router.push(directUrl);
    }
  };

  const handleSelectLocation = (prov: string) => {
    setSelectedLocation(prov);
    setIsLocationDropdownOpen(false);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-16">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. DUAL SEARCH BAR HERO BOX (S-CLASS OLED & GLASS SURFACE)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-montserrat font-bold tracking-[0.25em] uppercase mb-4">
            <Sparkles className="w-3 h-3" />
            <span>RED DE PROVEEDORES & PRODUCCIÓN HOMOLOGADA</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-francia tracking-tight mb-2">
            Encuentra Servicios Homologados y Producción de Gala
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 font-normal font-montserrat max-w-2xl mx-auto">
            Fincas, catering de alta escuela, artistas de conservatorio y equipamiento acústico con garantía de ejecución.
          </p>
        </div>

        {/* Dual Search Input Container — S-Class Dark Glass Surface */}
        <form 
          onSubmit={handleSearch}
          className="relative bg-[#0c0c12]/95 border border-white/15 rounded-3xl p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row items-stretch gap-2 text-white focus-within:border-[#ecb613]/50 focus-within:shadow-[0_0_35px_rgba(236,182,19,0.15)] transition-all backdrop-blur-2xl"
        >
          {/* Input 1: Servicio / Categoría / Nombre */}
          <div ref={categoryRef} className="relative flex-1">
            <div 
              onClick={() => {
                setIsCategoryDropdownOpen(prev => !prev);
                setIsLocationDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5 text-[#ecb613] shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsCategoryDropdownOpen(true)}
                placeholder="Busca por servicio, artista o categoría..."
                className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder-zinc-500 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Mega Menú Dropdown de Categorías Jerárquicas — S-Class Dark */}
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 right-0 md:w-[750px] bg-[#0e0e16] border border-white/15 rounded-3xl shadow-2xl p-6 z-50 text-left mt-2 animate-in fade-in max-h-[75vh] overflow-y-auto backdrop-blur-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-zinc-300">
                  
                  {/* Col 1: Lugares & Fincas */}
                  <div className="space-y-3">
                    <div 
                      onClick={() => handleSelectCategory('Lugares para Boda', '/bodas/fincas-toledo-sonorizacion-gala')}
                      className="flex items-center gap-2 font-bold text-white text-sm pb-1 border-b border-white/10 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-[#ecb613]" />
                      <span>Lugares para Boda</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {['Fincas', 'Masías', 'Hoteles', 'Restaurantes', 'Salones de Boda', 'Castillos & Palacetes', 'Cortijos', 'Espacios Singulares', 'Haciendas', 'Bodegas', 'Bodas en la Playa'].map((sub) => (
                        <div 
                          key={sub}
                          onClick={() => handleSelectCategory(sub)}
                          className="text-zinc-400 hover:text-[#ecb613] hover:translate-x-1 transition-all cursor-pointer font-normal"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Catering Gourmet')}
                      className="flex items-center gap-2 font-bold text-white text-sm pt-3 border-t border-white/10 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Utensils className="w-4 h-4 text-[#ecb613]" />
                      <span>Catering Gourmet</span>
                    </div>
                  </div>

                  {/* Col 2: Música, Chófer & Fotografía */}
                  <div className="space-y-3">
                    <div 
                      onClick={() => handleSelectCategory('Música para Boda', '/artistas/edwin-agudelo')}
                      className="flex items-center gap-2 font-bold text-white text-sm pb-1 border-b border-white/10 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Music className="w-4 h-4 text-[#ecb613]" />
                      <span>Música & Artistas</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {[
                        { title: 'Show Solista Edwin Agudelo', url: '/artistas/edwin-agudelo' },
                        { title: 'Dúos y Cuartetos Clásicos', url: '/artistas/edwin-agudelo' },
                        { title: 'DJs de Boda S-Class', url: '/artistas/djs' },
                        { title: 'Orquestas de Representación', url: '/artistas/orquestas' },
                        { title: 'Sonorización Pista-BPM Bose', url: '/infraestructura' }
                      ].map((item) => (
                        <div 
                          key={item.title}
                          onClick={() => handleSelectCategory(item.title, item.url)}
                          className="text-zinc-400 hover:text-[#ecb613] hover:translate-x-1 transition-all cursor-pointer font-normal"
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Coches de Boda & Chófer VIP', '/servicios/chofer-vip')}
                      className="flex items-center gap-2 font-bold text-white text-sm pt-2 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Car className="w-4 h-4 text-[#ecb613]" />
                      <span>Coches de Boda VIP</span>
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Fotógrafos de Autor')}
                      className="flex items-center gap-2 font-bold text-white text-sm pt-1 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#ecb613]" />
                      <span>Fotógrafos & Vídeo 4K</span>
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Autobuses & Minivans')}
                      className="flex items-center gap-2 font-bold text-white text-sm pt-1 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Bus className="w-4 h-4 text-[#ecb613]" />
                      <span>Autobuses para Invitados</span>
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Mobiliario & Carpas')}
                      className="flex items-center gap-2 font-bold text-white text-sm pt-1 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-[#ecb613]" />
                      <span>Mobiliario & Carpas</span>
                    </div>
                  </div>

                  {/* Col 3: Novias, Flores & Complementos */}
                  <div className="space-y-3">
                    <div 
                      onClick={() => handleSelectCategory('Food Trucks & Mesas Dulces')}
                      className="flex items-center gap-2 font-bold text-white text-sm pb-1 border-b border-white/10 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Cake className="w-4 h-4 text-[#ecb613]" />
                      <span>Food Truck & Dulces</span>
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Floristerías & Ramos')}
                      className="flex items-center gap-2 font-bold text-white text-sm hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Flower2 className="w-4 h-4 text-[#ecb613]" />
                      <span>Floristerías</span>
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Joyería & Alianzas')}
                      className="flex items-center gap-2 font-bold text-white text-sm hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-[#ecb613]" />
                      <span>Joyería & Alianzas</span>
                    </div>

                    <div 
                      onClick={() => handleSelectCategory('Novias & Alta Costura')}
                      className="flex items-center gap-2 font-bold text-white text-sm pt-2 hover:text-[#ecb613] transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-[#ecb613]" />
                      <span>Novias & Trajes</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {['Talleres de Novia', 'Tiendas de Novia', 'Complementos Novia', 'Trajes de Madrina', 'Trajes de Fiesta'].map((sub) => (
                        <div 
                          key={sub}
                          onClick={() => handleSelectCategory(sub)}
                          className="text-zinc-400 hover:text-[#ecb613] hover:translate-x-1 transition-all cursor-pointer font-normal"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banner S-Class Care */}
                <div className="mt-6 p-4 rounded-2xl bg-[#14141e] border border-[#ecb613]/25 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-7 h-7 text-[#ecb613] shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Garantía de Solvencia S-Class</h4>
                      <p className="text-[11px] text-zinc-400">Todos los proveedores cuentan con verificación técnica y póliza de responsabilidad civil.</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#ecb613] text-black font-bold text-xs uppercase tracking-wider shrink-0 font-montserrat">
                    S-Class Shield
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input 2: Selector de Ubicación / Provincia */}
          <div ref={locationRef} className="relative md:w-72 border-t md:border-t-0 md:border-l border-white/10">
            <div 
              onClick={() => {
                setIsLocationDropdownOpen(prev => !prev);
                setIsCategoryDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <span className="text-xs text-[#ecb613] font-bold uppercase">en</span>
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                onFocus={() => setIsLocationDropdownOpen(true)}
                placeholder="Dónde (Provincia)"
                className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder-zinc-500 focus:outline-none cursor-pointer"
              />
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            </div>

            {/* Dropdown de Provincias — S-Class Dark */}
            {isLocationDropdownOpen && (
              <div className="absolute top-full left-0 right-0 md:w-80 bg-[#0e0e16] border border-white/15 rounded-3xl shadow-2xl p-4 z-50 text-left mt-2 animate-in fade-in max-h-80 overflow-y-auto backdrop-blur-3xl">
                <div className="flex items-center border-b border-white/10 pb-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setLocationTab('provincia')}
                    className={`flex-1 py-1.5 text-xs font-bold text-center border-b-2 transition-all ${
                      locationTab === 'provincia' ? 'border-[#ecb613] text-[#ecb613]' : 'border-transparent text-zinc-400'
                    }`}
                  >
                    España (Provincias)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationTab('internacional')}
                    className={`flex-1 py-1.5 text-xs font-bold text-center border-b-2 transition-all ${
                      locationTab === 'internacional' ? 'border-[#ecb613] text-[#ecb613]' : 'border-transparent text-zinc-400'
                    }`}
                  >
                    Destinos VIP
                  </button>
                </div>

                <div className="space-y-1">
                  {(locationTab === 'provincia' ? PROVINCIAS_ESPANA : ['Ibiza & Formentera', 'Mallorca', 'Menorca', 'Marbella & Costa del Sol', 'Canarias']).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => handleSelectLocation(prov)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:bg-white/10 hover:text-white font-medium transition-colors flex items-center justify-between"
                    >
                      <span>{prov}</span>
                      {selectedLocation === prov && <Check className="w-3.5 h-3.5 text-[#ecb613]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botón de Búsqueda S-Class */}
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-extrabold font-montserrat text-sm sm:text-base transition-all shadow-lg shadow-[#ecb613]/25 hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Buscar</span>
          </button>
        </form>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. EMPIEZA A CONTRATAR TUS PROVEEDORES S-CLASS (GRID DE ACCESOS)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white font-francia">
            Servicios & Proveedores Homologados
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Fotógrafos', icon: Camera, url: '/proveedores?cat=fotografos' },
            { title: 'Vídeo & Dron 4K', icon: Camera, url: '/proveedores?cat=video' },
            { title: 'Música en Directo', icon: Music, url: '/artistas/edwin-agudelo' },
            { title: 'Catering Gourmet', icon: Utensils, url: '/proveedores?cat=catering' },
            { title: 'Coches de Boda VIP', icon: Car, url: '/servicios/chofer-vip' },
            { title: 'Autobuses para Invitados', icon: Bus, url: '/servicios/chofer-vip' },
            { title: 'Floristerías', icon: Flower2, url: '/proveedores?cat=flores' },
            { title: 'Invitaciones de Boda', icon: Heart, url: '/proveedores?cat=invitaciones' },
            { title: 'Detalles de Bodas', icon: Gift, url: '/proveedores?cat=detalles' },
          ].map((catItem, idx) => (
            <Link
              key={idx}
              href={catItem.url}
              className="p-4 rounded-2xl bg-[#0c0c12]/90 border border-white/10 hover:border-[#ecb613]/50 hover:bg-[#151520] transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20 group-hover:scale-110 transition-transform">
                <catItem.icon className="w-5 h-5 text-[#ecb613]" />
              </div>
              <span className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors font-montserrat">
                {catItem.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Otras Categorías (Pills) */}
        <div className="pt-2 border-t border-white/10">
          <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold block mb-3">
            Otras Categorías S-Class:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              'Mobiliario', 'Carpas', 'Animación', 'Decoración para bodas', 
              'Listas de boda', 'Organización Bodas', 'Tartas de boda', 
              'Food truck y mesas dulces', 'Alumbrado Monumental', 'Promociones'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelectCategory(tag)}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 text-xs text-zinc-300 transition-all font-medium cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. CAROUSEL CIRCULAR DE ZONAS & BANQUETES ("BANQUETES POR ZONA")
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-francia">
              Espacios y Banquetes por Zona
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Explora las fincas, masías y espacios nupciales más codiciados de España.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={carouselRef}
          className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
        >
          {ZONES_LIST.map((zone) => (
            <Link
              key={zone.name}
              href={`/bodas/fincas-${zone.slug}-sonorizacion-gala`}
              className="flex flex-col items-center text-center group shrink-0 w-28 sm:w-36 cursor-pointer"
            >
              {/* Circular Avatar with Zoom Effect */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/15 group-hover:border-[#ecb613] group-hover:shadow-[0_0_25px_rgba(236,182,19,0.4)] transition-all duration-300 relative bg-neutral-900 mb-3">
                <img 
                  src={zone.image} 
                  alt={zone.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors">
                {zone.name}
              </h4>
              <span className="text-[11px] text-neutral-400 font-mono">
                {zone.count} banquetes
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
