import { create } from 'zustand';

export interface GuestBreakdown {
  adults: number;
  children: number;
  babies: number;
  pets: number;
}

export interface DateFlexibility {
  startDate: string | null;
  endDate: string | null;
  mode: 'exact' | 'flexible';
  flexDays: 0 | 1 | 2 | 3 | 7 | 14;
}

interface EcosystemFilterState {
  province: string;
  municipality: string;
  guests: GuestBreakdown;
  dates: DateFlexibility;
  category: string;
  subcategory: string;
  petFriendly: boolean;
  maxDbLimit: number;
  hasPlanB: boolean;

  setGuests: (type: keyof GuestBreakdown, delta: number) => void;
  setDateRange: (dates: Partial<DateFlexibility>) => void;
  setCategory: (cat: string, subcat?: string) => void;
  setGeoLocation: (province: string, municipality?: string) => void;
  setSupplierPolicy: (key: 'petFriendly' | 'hasPlanB', val: boolean) => void;
  resetFilters: () => void;
}

export const useEcosystemFilterStore = create<EcosystemFilterState>((set) => ({
  province: 'madrid',
  municipality: '',
  guests: { adults: 80, children: 0, babies: 0, pets: 0 },
  dates: { startDate: null, endDate: null, mode: 'exact', flexDays: 0 },
  category: 'all',
  subcategory: 'all',
  petFriendly: false,
  maxDbLimit: 120,
  hasPlanB: true,

  setGuests: (type, delta) => set((state) => ({
    guests: {
      ...state.guests,
      [type]: Math.max(0, state.guests[type] + delta)
    }
  })),

  setDateRange: (newDates) => set((state) => ({
    dates: { ...state.dates, ...newDates }
  })),

  setCategory: (category, subcategory = 'all') => set({ category, subcategory }),
  setGeoLocation: (province, municipality = '') => set({ province, municipality }),
  setSupplierPolicy: (key, val) => set({ [key]: val }),

  resetFilters: () => set({
    guests: { adults: 80, children: 0, babies: 0, pets: 0 },
    dates: { startDate: null, endDate: null, mode: 'exact', flexDays: 0 },
    category: 'all',
    subcategory: 'all',
    petFriendly: false
  })
}));
