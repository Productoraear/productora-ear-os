"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Signal {
  isB2G: boolean;
}

interface SovereignContextType {
  signal: Signal;
  updateSignal: (newSignal: Partial<Signal>) => void;
}

const defaultContext: SovereignContextType = {
  signal: { isB2G: false },
  updateSignal: () => {},
};

const SovereignContext = createContext<SovereignContextType>(defaultContext);

export const SovereignProvider = ({ children }: { children: ReactNode }) => {
  const [signal, setSignalState] = useState<Signal>({ isB2G: false });

  const updateSignal = (newSignal: Partial<Signal>) => {
    setSignalState((prev) => ({ ...prev, ...newSignal }));
  };

  return (
    <SovereignContext.Provider value={{ signal, updateSignal }}>
      {children}
    </SovereignContext.Provider>
  );
};

export const useSovereignContext = () => useContext(SovereignContext);
