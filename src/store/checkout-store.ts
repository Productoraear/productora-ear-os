import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StageFormatType, VenueType } from '@/components/stage/StageVisualizer3D';

interface CheckoutState {
  selectedFormatId: StageFormatType;
  distanceKm: number;
  selectedVenue: VenueType;
  pax: number;
  eventDate: string;
  isNightHour: boolean;
  clientName: string;
  clientPhone: string;
  setFormatId: (id: StageFormatType) => void;
  setDistanceKm: (km: number) => void;
  setVenue: (venue: VenueType) => void;
  setPax: (pax: number) => void;
  setEventDate: (date: string) => void;
  setIsNightHour: (isNight: boolean) => void;
  setClientName: (name: string) => void;
  setClientPhone: (phone: string) => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      selectedFormatId: 'solista',
      distanceKm: 30,
      selectedVenue: 'SALON_BODA',
      pax: 120,
      eventDate: '2026-09-15',
      isNightHour: false,
      clientName: '',
      clientPhone: '',
      
      setFormatId: (id) => set({ selectedFormatId: id }),
      setDistanceKm: (km) => set({ distanceKm: km }),
      setVenue: (venue) => set({ selectedVenue: venue }),
      setPax: (pax) => set({ pax }),
      setEventDate: (date) => set({ eventDate: date }),
      setIsNightHour: (isNight) => set({ isNightHour: isNight }),
      setClientName: (name) => set({ clientName: name }),
      setClientPhone: (phone) => set({ clientPhone: phone }),
    }),
    {
      name: 'ear-os-checkout-storage',
    }
  )
);
