
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveEvent {
  id: string;
  type: 'booking' | 'match' | 'venue' | 'artist';
  status: 'pending' | 'confirmed' | 'completed';
  timestamp: number;
  label: string;
}

export function LiveFeed() {
  const [events, setEvents] = useState<LiveEvent[]>([]);

  useEffect(() => {
    const types: ('booking' | 'match' | 'venue' | 'artist')[] = ['booking', 'match', 'venue', 'artist'];
    const labels = [
      'Reserva confirmada en Madrid',
      'Match de Aura: 98% (Sinfonía)',
      'Venue Activo: Palacio de la Escucha',
      'Artista en ruta: Edwin Agudelo',
      'Nuevo Contrato: Pack 360 EAR'
    ];

    const interval = setInterval(() => {
      const newEvent: LiveEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: types[Math.floor(Math.random() * types.length)],
        status: 'confirmed',
        timestamp: Date.now(),
        label: labels[Math.floor(Math.random() * labels.length)]
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
        Live Neural Feed
      </h3>
      <div className="relative min-h-[300px] flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ x: 50, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -20, opacity: 0, scale: 0.9 }}
              transition={{ 
                type: 'spring',
                stiffness: 260,
                damping: 20
              }}
              className="bg-white/[0.03] border-l-2 border-gold-500 p-4 rounded-r-xl backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-black text-gold-500 uppercase tracking-widest">
                  {event.type}
                </span>
                <span className="text-[8px] text-white/20">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-xs font-bold text-white/80">
                {event.label}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
