import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Package {
  name: string;
  items: string[];
  price: number;
}

interface CalculatorState {
  // Parámetros de Entrada
  budget: number;
  attendees: number;
  eventType: string;
  
  // Resultados Predictivos (Oráculo)
  selectedPackage: Package | null;
  calculatedMargin: number;
  roiProjected: number;
  auraScore: number;
  
  // Acciones Maestro
  setBudget: (val: number) => void;
  setAttendees: (val: number) => void;
  setEventType: (val: string) => void;
  calculatePackage: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      budget: 5000,
      attendees: 100,
      eventType: 'corporativo',
      selectedPackage: null,
      calculatedMargin: 0,
      roiProjected: 0,
      auraScore: 0,

      setBudget: (val) => {
        set({ budget: val });
        get().calculatePackage();
      },

      setAttendees: (val) => {
        set({ attendees: val });
        get().calculatePackage();
      },

      setEventType: (val) => {
        set({ eventType: val });
        get().calculatePackage();
      },

      calculatePackage: () => {
        const { budget, eventType, attendees } = get();
        
        // 🧠 LÓGICA DE TRANSFUSIÓN (RECUPERADA DE LEGACY V1)
        // Algoritmo de Emparejamiento Táctico
        let pkg: Package = { name: "Basic Pack", items: ["Sonido Estándar", "Iluminación Básica"], price: budget * 0.8 };
        let auraBase = 7.5;
        
        if (eventType === 'boda') {
          pkg = { 
            name: "Aura Wedding", 
            items: ["Sonido Hi-Fi", "Iluminación Arquitectural", "DJ Set Premium"], 
            price: budget * 0.75 
          };
          auraBase = 8.5;
        } else if (eventType === 'concierto') {
          pkg = { 
            name: "Live Arena", 
            items: ["Line Array RCF", "Moving Heads", "Técnico RF"], 
            price: budget * 0.85 
          };
          auraBase = 9.2;
        }

        // Ajuste por volumen (Attendees)
        if (attendees > 300) {
          pkg.items.push("Refuerzo de Graves", "Asistente de Producción");
          pkg.price *= 1.1;
        }

        // Cálculo de Margen Forense (Ledger Compatibility)
        const margin = budget - pkg.price;
        const roi = (margin / budget) * 100;
        const finalAura = Math.min(10, auraBase + (budget > 15000 ? 0.5 : 0));

        set({ 
          selectedPackage: pkg,
          calculatedMargin: margin,
          roiProjected: Number(roi.toFixed(1)),
          auraScore: Number(finalAura.toFixed(1))
        });
      }
    }),
    {
      name: 'ear-calculator-storage',
    }
  )
);
