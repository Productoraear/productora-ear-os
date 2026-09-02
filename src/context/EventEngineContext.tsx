'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type SophisticationLevel = 'tactical' | 'neural' | 'vanguard';

interface EventEngineState {
    budget: number;
    guestCount: number;
    atmosphere: number; 
    locks: {
        budget: boolean;
        guestCount: boolean;
        atmosphere: boolean;
    };
}

interface EventEngineContextType extends EventEngineState {
    setBudget: (val: number) => void;
    setGuestCount: (val: number) => void;
    setAtmosphere: (val: number) => void;
    toggleLock: (key: keyof EventEngineState['locks']) => void;
    costPerPerson: number;
    sophistication: SophisticationLevel;
}

const EventEngineContext = createContext<EventEngineContextType | undefined>(undefined);

const BASE_COST_PER_PERSON = 80; 
const VANGUARD_MULTIPLIER = 3.5; 

export const EventEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<EventEngineState>({
        budget: 15000,
        guestCount: 100,
        atmosphere: 50, 
        locks: {
            budget: false,
            guestCount: true, 
            atmosphere: false,
        }
    });

    const costPerPerson = state.budget / state.guestCount;

    const sophistication: SophisticationLevel =
        state.atmosphere < 33 ? 'tactical' :
            state.atmosphere < 66 ? 'neural' : 'vanguard';

    const costToAtmosphere = (cost: number) => {
        const normalized = (cost - BASE_COST_PER_PERSON) / (BASE_COST_PER_PERSON * (VANGUARD_MULTIPLIER - 1));
        return Math.max(0, Math.min(100, normalized * 100));
    };

    const atmosphereToCost = (atm: number) => {
        const multiplier = 1 + (atm / 100) * (VANGUARD_MULTIPLIER - 1);
        return BASE_COST_PER_PERSON * multiplier;
    };

    const setBudget = (val: number) => {
        setState(prev => {
            let next = { ...prev, budget: val };
            if (prev.locks.guestCount) {
                const newCost = val / prev.guestCount;
                next.atmosphere = costToAtmosphere(newCost);
            } else {
                const currentCPP = atmosphereToCost(prev.atmosphere);
                next.guestCount = Math.round(val / currentCPP);
            }
            return next;
        });
    };

    const setGuestCount = (val: number) => {
        setState(prev => {
            let next = { ...prev, guestCount: val };
            if (prev.locks.budget) {
                const newCost = prev.budget / val;
                next.atmosphere = costToAtmosphere(newCost);
            } else {
                const currentCPP = atmosphereToCost(prev.atmosphere);
                next.budget = val * currentCPP;
            }
            return next;
        });
    };

    const setAtmosphere = (val: number) => {
        setState(prev => {
            let next = { ...prev, atmosphere: val };
            const newCPP = atmosphereToCost(val);
            if (prev.locks.budget) {
                next.guestCount = Math.round(prev.budget / newCPP);
            } else {
                next.budget = prev.guestCount * newCPP;
            }
            return next;
        });
    };

    const toggleLock = (key: keyof EventEngineState['locks']) => {
        setState(prev => ({
            ...prev,
            locks: { ...prev.locks, [key]: !prev.locks[key] }
        }));
    };

    return (
        <EventEngineContext.Provider value={{
            ...state,
            setBudget,
            setGuestCount,
            setAtmosphere,
            toggleLock,
            costPerPerson,
            sophistication
        }}>
            {children}
        </EventEngineContext.Provider>
    );
};

export const useEventEngine = () => {
    const context = useContext(EventEngineContext);
    if (!context) throw new Error('useEventEngine must be used within EventEngineProvider');
    return context;
};
