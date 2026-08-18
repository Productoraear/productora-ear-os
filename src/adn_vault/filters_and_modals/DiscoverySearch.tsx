"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Search, ChevronDown, Check, Building, Clapperboard, Mic2, Users, Briefcase, Heart, Sparkles, Trophy, Music } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { es } from 'date-fns/locale';

// --- ARQUITECTURA DE OCASIONES (PESTAÑAS DE INTENCIÓN) ---
const INTENT_TABS = [
  { id: "bodas", label: "Bodas", icon: Heart },
  { id: "corporativo", label: "Corporativo", icon: Briefcase },
  { id: "institucional", label: "Institucional", icon: Building },
  { id: "shows", label: "Shows & Festivales", icon: Clapperboard },
  { id: "privados", label: "Eventos Privados", icon: Sparkles },
];

// --- DATOS DE TERRITORIO (SIMPLIFICADO PARA LA UI) ---
const PROVINCIAS_SPAIN = [
    { name: "Madrid" }, { name: "Barcelona" }, { name: "Valencia" }, { name: "Sevilla" }, { name: "Málaga" }, { name: "Zaragoza" }, { name: "Murcia" }, { name: "Alicante" }, { name: "Baleares" }, // ...y más
];


export default function DiscoverySearch() {
  const [selectedIntent, setSelectedIntent] = useState("bodas");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Cierra el calendario si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSearch = () => {
    console.log("Iniciando búsqueda con:", {
      intent: selectedIntent,
      location: locationQuery,
      date: selectedDate,
    });
    // Aquí iría la lógica para mostrar el modal de resultados o navegar a la página de resultados
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* 1. PESTAÑAS DE INTENCIÓN */}
      <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 p-2 bg-card/50 border border-border rounded-full">
        {INTENT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedIntent(tab.id)}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-black uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 ${
              selectedIntent === tab.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 2. FILTROS PRINCIPALES (TERRITORIO Y FECHA) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-card/70 backdrop-blur-3xl border border-border rounded-[2rem] p-3 shadow-xl">
        
        {/* Territorio Unificado */}
        <div className="md:col-span-3 flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
          <MapPin size={18} className="text-primary" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Provincia, Ciudad o Código Postal..."
            className="w-full bg-transparent border-none outline-none text-foreground text-sm font-bold placeholder:text-muted-foreground focus:ring-0"
          />
        </div>

        {/* Calendario Flotante (Popover) */}
        <div className="md:col-span-2 flex items-center gap-2 relative">
          <div ref={calendarRef} className="w-full">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <CalendarIcon size={18} className="text-primary" />
                <span className={`text-sm font-bold ${selectedDate ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {selectedDate ? selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : "Seleccionar Fecha"}
                </span>
              </div>
              <ChevronDown size={16} className={`text-primary transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isCalendarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 z-[300] bg-card border border-border rounded-2xl shadow-2xl"
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }}
                    locale={es}
                    className="p-4"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* 3. BOTÓN DE BÚSQUEDA (CTA) */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-primary text-primary-foreground px-16 py-4 rounded-full font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(236,182,19,0.2)]"
        >
          <Search size={18} />
          Discovery
        </button>
      </div>
    </div>
  );
}