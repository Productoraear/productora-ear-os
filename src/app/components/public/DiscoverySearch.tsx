"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  PartyPopper, 
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OCASIONES = [
  "Gala Institucional",
  "Congreso Técnico Corporativo",
  "Cumbre de Alto Impacto",
  "Intervención Sociosanitaria",
  "Cena de Gala / Protocolo",
  "Acto de Patrimonio Histórico",
  "Incentivo Profesional",
  "Apertura Institucional"
];

const TERRITORIOS = [
  { region: "España", cities: ["Madrid", "Barcelona", "Marbella", "Sevilla", "Toledo", "Baleares", "Canarias"] },
  { region: "Europa", cities: ["París", "Londres", "Milán", "Roma", "Berlín", "Lisboa"] },
];

export default function DiscoverySearch() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOcasion, setSelectedOcasion] = useState("");
  const [selectedTerritorio, setSelectedTerritorio] = useState("");
  const [selectedFecha, setSelectedFecha] = useState("");
  
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

  return (
    <div className="relative w-full max-w-5xl mx-auto" ref={dropdownRef}>
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-4 flex flex-col md:flex-row items-stretch gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* OCASIÓN */}
        <button 
          onClick={() => setActiveDropdown(activeDropdown === "ocasion" ? null : "ocasion")}
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
                className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 rounded-3xl p-4 z-[200] shadow-2xl backdrop-blur-2xl"
              >
                <div className="grid grid-cols-1 gap-2">
                  {OCASIONES.map(item => (
                    <div 
                      key={item}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOcasion(item);
                        setActiveDropdown(null);
                      }}
                      className="px-6 py-3 rounded-xl hover:bg-[#ecb613] hover:text-black text-white/60 text-xs font-bold uppercase italic tracking-widest transition-all cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="w-px bg-white/10 self-stretch my-4 hidden md:block" />

        {/* TERRITORIO */}
        <button 
          onClick={() => setActiveDropdown(activeDropdown === "territorio" ? null : "territorio")}
          className="flex-1 px-8 py-4 rounded-[2rem] hover:bg-white/5 transition-all text-left group relative"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] mb-1 flex items-center gap-2">
            <MapPin size={12} />
            Territorio
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold italic truncate ${selectedTerritorio ? 'text-white' : 'text-white/30'}`}>
              {selectedTerritorio || "Toda España"}
            </span>
            <ChevronDown size={14} className={`text-[#ecb613] transition-transform duration-300 ${activeDropdown === "territorio" ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {activeDropdown === "territorio" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 z-[200] shadow-2xl backdrop-blur-2xl min-w-[300px]"
              >
                <div className="space-y-6">
                  {TERRITORIOS.map(({ region, cities }) => (
                    <div key={region} className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 border-b border-white/5 pb-2">{region}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {cities.map(city => (
                          <div 
                            key={city}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTerritorio(city);
                              setActiveDropdown(null);
                            }}
                            className="px-4 py-2 rounded-lg hover:bg-[#ecb613] hover:text-black text-white/50 text-[10px] font-black uppercase italic tracking-widest transition-all cursor-pointer"
                          >
                            {city}
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

        {/* TEMPORADA / CALENDARIO */}
        <div className="flex-1 px-8 py-4 rounded-[2rem] hover:bg-white/5 transition-all text-left group relative">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] mb-1 flex items-center gap-2">
            <CalendarIcon size={12} />
            Temporada
          </p>
          <input 
            type="date"
            onChange={(e) => setSelectedFecha(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-bold italic text-white focus:outline-none appearance-none cursor-pointer [color-scheme:dark]"
            placeholder="Seleccionar Fecha"
          />
        </div>

        {/* DISCOVERY BUTTON */}
        <button className="bg-[#ecb613] text-black px-12 py-4 rounded-full font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)]">
          Discovery
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
