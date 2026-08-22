import { useState, useEffect } from 'react';
export function useTourTracking(tourId) {
    const [status, setStatus] = useState({
        phase: 'EN_RUTA',
        progress: 35,
        speed: 110,
        estimatedArrival: '19:45 CEST',
        currentLocation: { lat: 40.4168, lng: -3.7038 }, // Madrid base
        lastPing: null, // Prevent Hydration Mismatch
        anomalies: [],
    });
    const [isSimulating, setIsSimulating] = useState(true);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        setStatus(prev => ({ ...prev, lastPing: new Date() }));
    }, []);
    useEffect(() => {
        if (!isSimulating)
            return;
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
        resolveAnomaly: (anomalyId) => {
            setStatus(prev => ({
                ...prev,
                anomalies: prev.anomalies.filter(a => a !== anomalyId)
            }));
        }
    };
}
