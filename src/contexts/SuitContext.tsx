import React, { createContext, useContext, useState } from 'react';

type SuitType = 'sovereign' | 'omega' | 'alpha' | 'stealth';

interface SuitContextType {
    activeSuit: SuitType;
    setSuit: (suit: SuitType) => void;
}

const SuitContext = createContext<SuitContextType>({ activeSuit: 'sovereign', setSuit: () => {} });

export const SuitProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeSuit, setSuit] = useState<SuitType>('sovereign');
    return (
        <SuitContext.Provider value={{ activeSuit, setSuit }}>
            {children}
        </SuitContext.Provider>
    );
};

export const useSuit = () => useContext(SuitContext);
