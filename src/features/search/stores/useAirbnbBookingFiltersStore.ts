import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getDistanceKmFromMentrida, 
  calculateLogisticsFee, 
  calculateAcousticRequirements,
  LogisticsCostBreakdown 
} from '../utils/mentridaDistanceEngine';

export type EventType = 'BODA' | 'CORPORATIVO' | 'B2G' | 'PRIVADO' | 'CONCIERTO';

export interface AirbnbBookingFiltersState {
  // Booking Fields
  eventDate: string; // YYYY-MM-DD
  province: string;
  municipality: string;
  gpsCoords: { lat: number; lng: number } | null;
  pax: number;
  endHour: number; // e.g. 4 (4:00 AM)
  
  // Advanced Intelligent Filters
  eventType: EventType;
  selectedCategories: string[];
  priceRange: [number, number];
  sClassOnly: boolean;
  b2gMode: boolean;
  maxSplDb: number | null; // e.g. 75 for B2G
  
  // Derived State Actions
  setEventDate: (date: string) => void;
  setLocation: (province: string, municipality?: string, coords?: { lat: number; lng: number } | null) => void;
  setPax: (pax: number) => void;
  setEndHour: (hour: number) => void;
  setEventType: (type: EventType) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSClassOnly: (val: boolean) => void;
  setB2gMode: (val: boolean) => void;
  resetFilters: () => void;

  // Calculators
  getDistanceKm: () => number;
  getLogisticsBreakdown: () => LogisticsCostBreakdown;
  getAcousticDiagnostic: () => { pax: number; wattsRms: number; setupDescription: string };
}

const DEFAULT_STATE = {
  eventDate: '',
  province: 'Madrid',
  municipality: '',
  gpsCoords: null,
  pax: 150,
  endHour: 3,
  eventType: 'BODA' as EventType,
  selectedCategories: [],
  priceRange: [350, 15000] as [number, number],
  sClassOnly: false,
  b2gMode: false,
  maxSplDb: null
};

export const useAirbnbBookingFiltersStore = create<AirbnbBookingFiltersState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setEventDate: (eventDate: string) => set({ eventDate }),

      setLocation: (province: string, municipality: string = '', gpsCoords: { lat: number; lng: number } | null = null) => {
        set({ province, municipality, gpsCoords });
      },

      setPax: (pax: number) => set({ pax: Math.max(10, pax) }),

      setEndHour: (endHour: number) => set({ endHour }),

      setEventType: (eventType: EventType) => {
        const isB2G = eventType === 'B2G';
        set({ 
          eventType, 
          b2gMode: isB2G,
          maxSplDb: isB2G ? 75 : null,
          priceRange: isB2G ? [1000, 14250] : get().priceRange
        });
      },

      toggleCategory: (category: string) => {
        const { selectedCategories } = get();
        const exists = selectedCategories.includes(category);
        const updated = exists 
          ? selectedCategories.filter(c => c !== category)
          : [...selectedCategories, category];
        set({ selectedCategories: updated });
      },

      setPriceRange: (priceRange: [number, number]) => set({ priceRange }),

      setSClassOnly: (sClassOnly: boolean) => set({ sClassOnly }),

      setB2gMode: (b2gMode: boolean) => {
        set({ 
          b2gMode, 
          maxSplDb: b2gMode ? 75 : null,
          eventType: b2gMode ? 'B2G' : get().eventType
        });
      },

      resetFilters: () => set({ ...DEFAULT_STATE }),

      getDistanceKm: () => {
        const { province, gpsCoords } = get();
        return getDistanceKmFromMentrida(province, gpsCoords);
      },

      getLogisticsBreakdown: () => {
        const distanceKm = get().getDistanceKm();
        const { endHour } = get();
        return calculateLogisticsFee(distanceKm, endHour);
      },

      getAcousticDiagnostic: () => {
        const { pax } = get();
        return calculateAcousticRequirements(pax);
      }
    }),
    {
      name: 'ear-airbnb-booking-filters-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
