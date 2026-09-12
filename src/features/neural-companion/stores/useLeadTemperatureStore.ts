import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LeadTemperature = 'COLD' | 'WARM' | 'HOT' | 'FIRE';

export interface LeadJourneyEvent {
  timestamp: string;
  action: string;
  path: string;
  metadata?: Record<string, any>;
}

interface LeadTemperatureState {
  temperature: LeadTemperature;
  score: number;
  visitedPages: string[];
  hasCompared: boolean;
  history: LeadJourneyEvent[];
  
  // Actions
  setTemperature: (temp: LeadTemperature) => void;
  recordPageView: (path: string) => void;
  recordComparisonIntent: (source?: string) => void;
  recordQuoteGenerated: (amount: number) => void;
  resetJourney: () => void;
}

export const useLeadTemperatureStore = create<LeadTemperatureState>()(
  persist(
    (set, get) => ({
      temperature: 'COLD',
      score: 10,
      visitedPages: [],
      hasCompared: false,
      history: [],

      setTemperature: (temp: LeadTemperature) => {
        set({ temperature: temp });
      },

      recordPageView: (path: string) => {
        const { visitedPages, score, temperature, history } = get();
        const updatedPages = visitedPages.includes(path) ? visitedPages : [...visitedPages, path];
        const newScore = score + 5;
        
        let newTemp: LeadTemperature = temperature;
        if (updatedPages.length >= 3 && temperature === 'COLD') {
          newTemp = 'WARM';
        }

        const newEvent: LeadJourneyEvent = {
          timestamp: new Date().toISOString(),
          action: 'PAGE_VIEW',
          path
        };

        set({
          visitedPages: updatedPages,
          score: newScore,
          temperature: newTemp,
          history: [...history.slice(-49), newEvent]
        });
      },

      recordComparisonIntent: (source = 'DIRECT') => {
        const { score, history } = get();
        const newEvent: LeadJourneyEvent = {
          timestamp: new Date().toISOString(),
          action: 'COMPARISON_INTENT',
          path: '/comparar',
          metadata: { source }
        };

        set({
          hasCompared: true,
          score: Math.max(score, 45),
          temperature: 'WARM',
          history: [...history.slice(-49), newEvent]
        });
      },

      recordQuoteGenerated: (amount: number) => {
        const { history } = get();
        const newEvent: LeadJourneyEvent = {
          timestamp: new Date().toISOString(),
          action: 'QUOTE_GENERATED',
          path: '/cotizador',
          metadata: { amount }
        };

        set({
          score: 80,
          temperature: 'HOT',
          history: [...history.slice(-49), newEvent]
        });
      },

      resetJourney: () => {
        set({
          temperature: 'COLD',
          score: 10,
          visitedPages: [],
          hasCompared: false,
          history: []
        });
      }
    }),
    {
      name: 'ear-lead-temperature-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
