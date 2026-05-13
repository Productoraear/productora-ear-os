'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Atmosphere = 'elegant' | 'cyber' | 'wild' | 'zen';

interface AtmosphereContextType {
  atmosphere: Atmosphere;
  setAtmosphere: (atm: Atmosphere) => void;
}

const AtmosphereContext = createContext<AtmosphereContextType | undefined>(undefined);

export const AtmosphereProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [atmosphere, setAtmosphere] = useState<Atmosphere>('elegant');

  useEffect(() => {
    const root = document.documentElement;
    const configs = {
      elegant: {
        gold: '#d4a855',
        glow: 'rgba(212, 168, 85, 0.1)',
        speed: '1.2s'
      },
      cyber: {
        gold: '#00f2ff',
        glow: 'rgba(0, 242, 255, 0.15)',
        speed: '0.4s'
      },
      wild: {
        gold: '#ff3e00',
        glow: 'rgba(255, 62, 0, 0.15)',
        speed: '0.8s'
      },
      zen: {
        gold: '#ffffff',
        glow: 'rgba(255, 255, 255, 0.05)',
        speed: '2s'
      }
    };

    const current = configs[atmosphere];
    root.style.setProperty('--aura-onyx-gold', current.gold);
    root.style.setProperty('--atm-glow-color', current.glow);
    root.style.setProperty('--atm-transition-speed', current.speed);
    
    // Smoothly update body class for specific CSS overrides
    document.body.className = document.body.className.replace(/atm-\w+/g, '');
    document.body.classList.add(`atm-${atmosphere}`);

  }, [atmosphere]);

  return (
    <AtmosphereContext.Provider value={{ atmosphere, setAtmosphere }}>
      {children}
    </AtmosphereContext.Provider>
  );
};

export const useAtmosphere = () => {
  const context = useContext(AtmosphereContext);
  if (!context) throw new Error('useAtmosphere must be used within AtmosphereProvider');
  return context;
};
