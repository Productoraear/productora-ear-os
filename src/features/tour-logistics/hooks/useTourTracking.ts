import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Usar variables de entorno de Supabase (asumimos que existen para Supabase Client)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface GeoLocation {
  lat: number;
  lng: number;
}

interface TourStatus {
  phase: 'DEPLOYMENT' | 'EN_RUTA' | 'SOUNDCHECK' | 'LIVE' | 'EXTRACTION';
  progress: number;
  speed: number; // km/h
  estimatedArrival: string;
  currentLocation: GeoLocation;
  lastPing: Date | null;
  anomalies: string[];
}

export function useTourTracking(tourId: string, unitId: string = 'default-unit') {
  const [status, setStatus] = useState<TourStatus>({
    phase: 'EN_RUTA',
    progress: 0,
    speed: 0,
    estimatedArrival: '--:-- CEST',
    currentLocation: { lat: 40.4168, lng: -3.7038 }, // Madrid base (fallback)
    lastPing: null,
    anomalies: [],
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (isSimulating || !supabaseUrl) return; // Fallback o Simulation

    // BALA DE PLATA 3: TELEMETRÍA REALTIME (Supabase / Postgres CDC)
    // Cero polling. Suscripción directa a la tabla FleetPosition para la unidad.
    const channel = supabase
      .channel(`fleet_tracking_${unitId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'FleetPosition', // Tabla de Prisma en Postgres
          filter: `unitId=eq.${unitId}`,
        },
        (payload) => {
          const newPos = payload.new;
          console.log('[Realtime FleetPosition]', newPos);
          
          setStatus(prev => ({
            ...prev,
            currentLocation: { lat: newPos.latitude, lng: newPos.longitude },
            speed: newPos.speed || prev.speed,
            lastPing: new Date(newPos.timestamp),
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [unitId, isSimulating]);

  // Fallback simulation mode for testing
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setStatus(prev => {
        const newProgress = Math.min(prev.progress + 1, 100);
        const newPhase = newProgress >= 100 ? 'LIVE' : (newProgress > 80 ? 'SOUNDCHECK' : 'EN_RUTA');
        return {
          ...prev,
          progress: newProgress,
          phase: newPhase,
          lastPing: new Date(),
          currentLocation: {
            lat: prev.currentLocation.lat + 0.001,
            lng: prev.currentLocation.lng + 0.001,
          }
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  return {
    status,
    isSimulating,
    toggleSimulation: () => setIsSimulating(!isSimulating),
    resolveAnomaly: (anomalyId: string) => {
      setStatus(prev => ({
        ...prev,
        anomalies: prev.anomalies.filter(a => a !== anomalyId)
      }));
    }
  };
}
