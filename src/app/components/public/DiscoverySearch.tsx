"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  PartyPopper, 
  ArrowRight,
  ChevronDown,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  CalendarCheck,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- CATEGORÍAS COMPLETAS DE OCASIONES ---
const OCASIONES = [
  {
    grupo: "Bodas y Celebraciones Familiares",
    items: [
      "Boda Civil & Banquete Premium",
      "Aniversario de Bodas (Plata/Oro)",
      "Petición de Mano Exclusiva",
      "Fiesta de Compromiso / Pre-boda",
      "Renovación de Votos Solas o Fincas"
    ]
  },
  {
    grupo: "Corporativo & B2B / B2G",
    items: [
      "Gala Institucional & Premios",
      "Congreso Técnico & Cumbres de Lujo",
      "Convención Anual & Meeting de Empresa",
      "Lanzamiento de Producto / Rueda de Prensa",
      "Homenaje Oficial & Acto de Estado",
      "Evento de Incentivo & Team Building"
    ]
  },
  {
    grupo: "Música & Gran Formato",
    items: [
      "Concierto de Gran Formato / Auditorio",
      "Festival Cultural & Espectáculos",
      "Fiestas Patronales & Eventos de Plaza",
      "Sonorización & Montaje de Directo"
    ]
  },
  {
    grupo: "Social & Impacto Vimume",
    items: [
      "Actos de Terapia Musical & Alzheimer",
      "Programas de Envejecimiento Activo",
      "Conmemoraciones Agenda 2030 (ODS)",
      "Gala de Beneficencia & Solidario"
    ]
  },
  {
    grupo: "Eventos Privados Premium",
    items: [
      "Fiesta Privada en Finca / Villa",
      "Cumpleaños de Alto Impacto",
      "Desfile de Moda / Brand Event",
      "Cóctel Exclusivo & Cena de Gala"
    ]
  }
];

// --- 50 PROVINCIAS COMPLETAS DE ESPAÑA Y SUS CIUDADES ---
const PROVINCIAS_SPAIN = [
  {
    region: "Andalucía",
    provinces: [
      { name: "Almería", cities: ["Almería", "Roquetas de Mar", "El Ejido", "Níjar", "Adra"] },
      { name: "Cádiz", cities: ["Cádiz", "Jerez de la Frontera", "Algeciras", "San Fernando", "El Puerto", "Chiclana"] },
      { name: "Córdoba", cities: ["Córdoba", "Lucena", "Puente Genil", "Montilla", "Priego de Córdoba"] },
      { name: "Granada", cities: ["Granada", "Motril", "Almuñécar", "Armilla", "Baza"] },
      { name: "Huelva", cities: ["Huelva", "Lepe", "Almonte", "Moguer", "Isla Cristina"] },
      { name: "Jaén", cities: ["Jaén", "Linares", "Úbeda", "Andújar", "Martos"] },
      { name: "Málaga", cities: ["Málaga", "Marbella", "Mijas", "Fuengirola", "Torremolinos", "Estepona", "Benalmádena", "Ronda"] },
      { name: "Sevilla", cities: ["Sevilla", "Dos Hermanas", "Alcalá de Guadaíra", "Utrera", "Mairena", "Écija"] }
    ]
  },
  {
    region: "Aragón",
    provinces: [
      { name: "Huesca", cities: ["Huesca", "Barbastro", "Monzón", "Fraga", "Jaca"] },
      { name: "Teruel", cities: ["Teruel", "Alcañiz", "Andorra", "Calamocha", "Utrillas"] },
      { name: "Zaragoza", cities: ["Zaragoza", "Calatayud", "Utebo", "Ejea de los Caballeros", "Tarazona"] }
    ]
  },
  {
    region: "Asturias",
    provinces: [
      { name: "Asturias", cities: ["Gijón", "Oviedo", "Avilés", "Siero", "Langreo", "Mieres"] }
    ]
  },
  {
    region: "Islas Baleares",
    provinces: [
      { name: "Islas Baleares", cities: ["Palma de Mallorca", "Ibiza", "Manacor", "Mahón", "Ciutadella", "San Antonio"] }
    ]
  },
  {
    region: "Canarias",
    provinces: [
      { name: "Las Palmas", cities: ["Las Palmas de G.C.", "Telde", "Santa Lucía de Tirajana", "Arrecife", "Puerto del Rosario"] },
      { name: "Santa Cruz de Tenerife", cities: ["Santa Cruz de Tenerife", "La Laguna", "Arona", "Granadilla de Abona", "Adeje"] }
    ]
  },
  {
    region: "Cantabria",
    provinces: [
      { name: "Cantabria", cities: ["Santander", "Torrelavega", "Castro Urdiales", "Camargo", "Piélagos", "Laredo"] }
    ]
  },
  {
    region: "Castilla y León",
    provinces: [
      { name: "Ávila", cities: ["Ávila", "Arévalo", "Arenas de San Pedro", "Las Navas del Marqués"] },
      { name: "Burgos", cities: ["Burgos", "Miranda de Ebro", "Aranda de Duero", "Briviesca"] },
      { name: "León", cities: ["León", "Ponferrada", "San Andrés del Rabanedo", "Villaquilambre"] },
      { name: "Palencia", cities: ["Palencia", "Aguilar de Campoo", "Guardo", "Venta de Baños"] },
      { name: "Salamanca", cities: ["Salamanca", "Santa Marta de Tormes", "Béjar", "Ciudad Rodrigo"] },
      { name: "Segovia", cities: ["Segovia", "El Espinar", "Cuéllar", "Real Sitio de San Ildefonso"] },
      { name: "Soria", cities: ["Soria", "Almazán", "El Burgo de Osma"] },
      { name: "Valladolid", cities: ["Valladolid", "Laguna de Duero", "Medina del Campo", "Arroyo de la Encomienda"] },
      { name: "Zamora", cities: ["Zamora", "Benavente", "Toro", "Morales del Vino"] }
    ]
  },
  {
    region: "Castilla-La Mancha",
    provinces: [
      { name: "Albacete", cities: ["Albacete", "Hellín", "Villarrobledo", "Almansa", "La Roda"] },
      { name: "Ciudad Real", cities: ["Ciudad Real", "Puertollano", "Tomelloso", "Alcázar de San Juan", "Valdepeñas"] },
      { name: "Cuenca", cities: ["Cuenca", "Tarancón", "Quintanar del Rey", "San Clemente"] },
      { name: "Guadalajara", cities: ["Guadalajara", "Azuqueca de Henares", "Alovera", "El Casar"] },
      { name: "Toledo", cities: ["Toledo", "Talavera de la Reina", "Illescas", "Seseña", "Torrijos", "Quintanar de la Orden"] }
    ]
  },
  {
    region: "Cataluña",
    provinces: [
      { name: "Barcelona", cities: ["Barcelona", "L'Hospitalet", "Badalona", "Sabadell", "Terrassa", "Mataró", "Sant Cugat", "Sitges", "Castelldefels"] },
      { name: "Gerona", cities: ["Girona", "Figueres", "Blanes", "Lloret de Mar", "Olot", "Salt"] },
      { name: "Lérida", cities: ["Lleida", "Tàrrega", "Balaguer", "Mollerussa"] },
      { name: "Tarragona", cities: ["Tarragona", "Reus", "Tortosa", "El Vendrell", "Cambrils", "Salou"] }
    ]
  },
  {
    region: "Comunidad Valenciana",
    provinces: [
      { name: "Alicante", cities: ["Alicante", "Elche", "Torrevieja", "Orihuela", "Benidorm", "Alcoy", "Elda", "Dénia", "Jávea"] },
      { name: "Castellón", cities: ["Castellón de la Plana", "Villarreal", "Burriana", "Vinaròs", "Onda"] },
      { name: "Valencia", cities: ["Valencia", "Torrent", "Gandia", "Paterna", "Sagunto", "Alzira", "Mislata", "Xàtiva"] }
    ]
  },
  {
    region: "Extremadura",
    provinces: [
      { name: "Badajoz", cities: ["Badajoz", "Mérida", "Don Benito", "Almendralejo", "Villanueva de la Serena"] },
      { name: "Cáceres", cities: ["Cáceres", "Plasencia", "Navalmoral de la Mata", "Coria"] }
    ]
  },
  {
    region: "Galicia",
    provinces: [
      { name: "La Coruña", cities: ["A Coruña", "Santiago de Compostela", "Ferrol", "Narón", "Oleiros", "Carballo"] },
      { name: "Lugo", cities: ["Lugo", "Monforte de Lemos", "Viveiro", "Vilalba"] },
      { name: "Orense", cities: ["Ourense", "O Carballiño", "Verín", "Valdeorras"] },
      { name: "Pontevedra", cities: ["Vigo", "Pontevedra", "Vilagarcía de Arousa", "Redondela", "Marín", "Cangas"] }
    ]
  },
  {
    region: "La Rioja",
    provinces: [
      { name: "La Rioja", cities: ["Logroño", "Calahorra", "Arnedo", "Haro"] }
    ]
  },
  {
    region: "Comunidad de Madrid",
    provinces: [
      { name: "Madrid", cities: ["Madrid", "Móstoles", "Alcalá de Henares", "Fuenlabrada", "Leganés", "Getafe", "Alcorcón", "Torrejón de Ardoz", "Parla", "Alcobendas", "Las Rozas"] }
    ]
  },
  {
    region: "Región de Murcia",
    provinces: [
      { name: "Murcia", cities: ["Murcia", "Cartagena", "Lorca", "Molina de Segura", "Alcantarilla", "Mazarrón"] }
    ]
  },
  {
    region: "Navarra",
    provinces: [
      { name: "Navarra", cities: ["Pamplona", "Tudela", "Barañáin", "Burlada", "Estella", "Tafalla"] }
    ]
  },
  {
    region: "País Vasco",
    provinces: [
      { name: "Álava", cities: ["Vitoria-Gasteiz", "Llodio", "Amurrio"] },
      { name: "Guipúzcoa", cities: ["San Sebastián", "Irún", "Rentería", "Eibar", "Zarautz"] },
      { name: "Vizcaya", cities: ["Bilbao", "Barakaldo", "Getxo", "Portugalete", "Santurtzi", "Basauri"] }
    ]
  },
  {
    region: "Ceuta y Melilla",
    provinces: [
      { name: "Ceuta", cities: ["Ceuta"] },
      { name: "Melilla", cities: ["Melilla"] }
    ]
  }
];

// --- DATOS DE ARTISTAS Y DISPONIBILIDAD ---
interface ArtistAvailability {
  name: string;
  category: string;
  avatar: string;
  daysBooked: string[]; // Formato YYYY-MM-DD
  status: "DISPONIBLE" | "ALTA DEMANDA" | "RESERVADO";
}

const ARTIST_ROSTER: ArtistAvailability[] = [
  {
    name: "Edwin Agudelo (Solista)",
    category: "Tenor & Música Clásica",
    avatar: "🎙️",
    daysBooked: ["2026-06-20", "2026-06-27", "2026-07-04"],
    status: "DISPONIBLE"
  },
  {
    name: "Edwin Agudelo (Mariachi)",
    category: "Mariachi de Lujo",
    avatar: "🎺",
    daysBooked: ["2026-06-20", "2026-06-21", "2026-07-11"],
    status: "DISPONIBLE"
  },
  {
    name: "Banda Monumental",
    category: "Orquesta de Gran Formato",
    avatar: "🎻",
    daysBooked: ["2026-06-27", "2026-07-18"],
    status: "DISPONIBLE"
  },
  {
    name: "Edwin Caballo (Show Ecuestre)",
    category: "Espectáculo Hípico Premium",
    avatar: "🐎",
    daysBooked: ["2026-07-04", "2026-07-25"],
    status: "DISPONIBLE"
  },
  {
    name: "Infraestructura Sonido / Iluminación",
    category: "Equipos de Alta Fidelidad L'Acoustics",
    avatar: "🔊",
    daysBooked: ["2026-06-20", "2026-06-27", "2026-07-18"],
    status: "DISPONIBLE"
  }
];

export default function DiscoverySearch() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOcasion, setSelectedOcasion] = useState("");
  const [selectedTerritorio, setSelectedTerritorio] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFecha, setSelectedFecha] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal de disponibilidad
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilityResults, setAvailabilityResults] = useState<ArtistAvailability[]>([]);
  const [selectedProvinceData, setSelectedProvinceData] = useState<any | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrado dinámico de provincias y ciudades de España
  const filteredProvincias = PROVINCIAS_SPAIN.map(reg => {
    const matchedProvinces = reg.provinces.filter(prov => {
      const nameMatches = prov.name.toLowerCase().includes(searchQuery.toLowerCase());
      const cityMatches = prov.cities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return nameMatches || cityMatches;
    });

    return {
      ...reg,
      provinces: matchedProvinces
    };
  }).filter(reg => reg.provinces.length > 0);

  // Comprobación de disponibilidad reactiva
  const handleCheckAvailability = (dateStr: string) => {
    if (!dateStr) return;
    setSelectedFecha(dateStr);
    
    // Procesamos la disponibilidad del Roster
    const results = ARTIST_ROSTER.map(artist => {
      const isBooked = artist.daysBooked.includes(dateStr);
      return {
        ...artist,
        status: isBooked ? "RESERVADO" : ("DISPONIBLE" as any)
      };
    });
    setAvailabilityResults(results);
    setShowAvailabilityModal(true);
  };

  const handleDiscoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFecha) {
      // Si no hay fecha elegida, abrimos modal con fecha por defecto de temporada de bodas
      handleCheckAvailability("2026-06-20");
    } else {
      handleCheckAvailability(selectedFecha);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto" ref={dropdownRef}>
      <form 
        onSubmit={handleDiscoverySubmit}
        className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-4 flex flex-col md:flex-row items-stretch gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        
        {/* OCASIÓN */}
        <button 
          type="button"
          onClick={() => {
            setActiveDropdown(activeDropdown === "ocasion" ? null : "ocasion");
            setSearchQuery("");
          }}
          className="flex-1 px-8 py-4 rounded-[2rem] hover:bg-white/5 transition-all text-left group relative"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] mb-1 flex items-center gap-2">
            <PartyPopper size={12} />
            Ocasión
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold italic truncate ${selectedOcasion ? 'text-white' : 'text-white/30'}`}>
              {selectedOcasion || "¿Qué celebras?"}
            </span>
            <ChevronDown size={14} className={`text-[#ecb613] transition-transform duration-300 ${activeDropdown === "ocasion" ? 'rotate-180' : ''}`} />
          </div>
          
          <AnimatePresence>
            {activeDropdown === "ocasion" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a]/95 border border-white/10 rounded-[2.5rem] p-6 z-[250] shadow-2xl backdrop-blur-3xl max-h-[400px] overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-6">
                  {OCASIONES.map(grupo => (
                    <div key={grupo.grupo} className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-1">{grupo.grupo}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {grupo.items.map(item => (
                          <div 
                            key={item}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOcasion(item);
                              setActiveDropdown(null);
                            }}
                            className="px-4 py-2.5 rounded-xl hover:bg-[#ecb613] hover:text-black text-white/60 text-[10px] font-black uppercase italic tracking-wider transition-all cursor-pointer text-left"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="w-px bg-white/10 self-stretch my-4 hidden md:block" />

        {/* TERRITORIO (50 PROVINCIAS COMPLETAS DE ESPAÑA Y SUS CIUDADES) */}
        <button 
          type="button"
          onClick={() => {
            setActiveDropdown(activeDropdown === "territorio" ? null : "territorio");
            setSearchQuery("");
            setSelectedProvinceData(null);
          }}
          className="flex-1 px-8 py-4 rounded-[2rem] hover:bg-white/5 transition-all text-left group relative"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] mb-1 flex items-center gap-2">
            <MapPin size={12} />
            Territorio
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold italic truncate ${selectedTerritorio ? 'text-white' : 'text-white/30'}`}>
              {selectedCity ? `${selectedTerritorio} (${selectedCity})` : (selectedTerritorio || "Toda España")}
            </span>
            <ChevronDown size={14} className={`text-[#ecb613] transition-transform duration-300 ${activeDropdown === "territorio" ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {activeDropdown === "territorio" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a]/95 border border-white/10 rounded-[2.5rem] p-6 z-[250] shadow-2xl backdrop-blur-3xl min-w-[340px] md:min-w-[500px]"
              >
                <div className="space-y-4">
                  {/* Buscador de Provincias / Ciudades */}
                  <div className="relative flex items-center mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <Search size={14} className="text-white/30 mr-2" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Filtrar por provincia o municipio de España..."
                      className="bg-transparent border-none outline-none text-white text-xs font-bold w-full focus:ring-0 placeholder:text-white/20"
                    />
                  </div>

                  {/* Vista de Selección de Municipios / Ciudades */}
                  {selectedProvinceData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Municipios de {selectedProvinceData.name}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProvinceData(null);
                          }}
                          className="text-[8px] font-black uppercase text-white/40 hover:text-white px-2 py-1 rounded bg-white/5"
                        >
                          Atrás
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTerritorio(selectedProvinceData.name);
                            setSelectedCity("Toda la Provincia");
                            setActiveDropdown(null);
                          }}
                          className="px-4 py-2.5 rounded-lg bg-[#ecb613]/10 hover:bg-[#ecb613] hover:text-black text-[#ecb613] text-[9px] font-black uppercase italic tracking-wider transition-all cursor-pointer"
                        >
                          Toda la Provincia
                        </div>
                        {selectedProvinceData.cities.map((city: string) => (
                          <div 
                            key={city}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTerritorio(selectedProvinceData.name);
                              setSelectedCity(city);
                              setActiveDropdown(null);
                            }}
                            className="px-4 py-2.5 rounded-lg hover:bg-[#ecb613] hover:text-black text-white/50 text-[9px] font-black uppercase italic tracking-wider transition-all cursor-pointer"
                          >
                            {city}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[260px] overflow-y-auto custom-scrollbar space-y-4 pr-1">
                      {filteredProvincias.map(reg => (
                        <div key={reg.region} className="space-y-2">
                          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-1">{reg.region}</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {reg.provinces.map(prov => (
                              <div 
                                key={prov.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProvinceData(prov);
                                }}
                                className="px-4 py-2.5 rounded-lg hover:bg-white/5 border border-white/5 text-white/70 text-[9px] font-black uppercase italic tracking-wider transition-all cursor-pointer flex justify-between items-center group/item"
                              >
                                <span>{prov.name}</span>
                                <span className="text-[7px] text-white/30 group-hover/item:text-[#ecb613]">{prov.cities.length} c.</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="w-px bg-white/10 self-stretch my-4 hidden md:block" />

        {/* TEMPORADA / CALENDARIO (CONEXIÓN EN CALIENTE CON DISPONIBILIDAD) */}
        <div className="flex-1 px-8 py-4 rounded-[2rem] hover:bg-white/5 transition-all text-left group relative">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] mb-1 flex items-center gap-2">
            <CalendarIcon size={12} />
            Temporada
          </p>
          <input 
            type="date"
            value={selectedFecha}
            onChange={(e) => handleCheckAvailability(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-bold italic text-white focus:outline-none appearance-none cursor-pointer [color-scheme:dark]"
            placeholder="Seleccionar Fecha"
          />
        </div>

        {/* DISCOVERY BUTTON */}
        <button 
          type="submit"
          className="bg-[#ecb613] text-black px-12 py-4 rounded-full font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)]"
        >
          Discovery
          <ArrowRight size={18} />
        </button>
      </form>

      {/* --- MODAL DE DISPONIBILIDAD REACTIVA DE ARTISTAS --- */}
      <AnimatePresence>
        {showAvailabilityModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0c0c0c] border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ecb613] via-amber-500 to-[#ecb613]/10" />

              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[8px] font-black uppercase tracking-widest">
                    <CalendarCheck size={10} /> Motor de Disponibilidad EAR OS
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">
                    Roster para el <span className="text-[#ecb613]">{selectedFecha}</span>
                  </h3>
                </div>
                <button 
                  onClick={() => setShowAvailabilityModal(false)}
                  className="text-white/40 hover:text-white text-xs font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>

              {/* Contenido de la búsqueda y disponibilidad */}
              <div className="space-y-6">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">
                  Verificación de calendario atómico para {selectedCity ? `${selectedCity}, ${selectedTerritorio}` : (selectedTerritorio || "España")}:
                </p>

                <div className="space-y-3">
                  {availabilityResults.map(artist => (
                    <div 
                      key={artist.name}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{artist.avatar}</span>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-tight text-white">{artist.name}</h4>
                          <p className="text-[9px] text-white/30 uppercase font-black">{artist.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {artist.status === "DISPONIBLE" ? (
                          <span className="flex items-center gap-1.5 text-[8px] font-black text-[#ecb613] border border-[#ecb613]/30 px-2 py-0.5 rounded uppercase">
                            <CheckCircle2 size={10} /> DISPONIBLE
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[8px] font-black text-red-500 border border-red-500/30 px-2 py-0.5 rounded uppercase bg-red-500/5">
                            <Clock size={10} /> RESERVADO
                          </span>
                        )}

                        <Link 
                          href={`/contacto?artista=${encodeURIComponent(artist.name)}&fecha=${selectedFecha}&ocasion=${encodeURIComponent(selectedOcasion)}`}
                          onClick={() => setShowAvailabilityModal(false)}
                          className="px-3.5 py-1.5 bg-[#ecb613] text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
                        >
                          Reservar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#ecb613]/5 border border-[#ecb613]/10 rounded-2xl p-4 flex gap-4 items-start">
                  <Info size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/50 leading-relaxed italic font-bold">
                    El bloqueo temporal de fecha garantiza la exclusividad del artista o equipamiento de sonido. Puedes formalizar el depósito de garantía de 100€ en la siguiente ventana de reserva para asegurar la fecha de tu evento.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
