"use client";
import React, { createContext, useContext, useState } from 'react';

interface PricerData {
  category: string;
  basePrice: number;
}

// Define the shape of your shared state
interface SharedState {
  events: any[];
  artists: any[];
  projects: any[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isPricerOpen: boolean;
  setIsPricerOpen: (open: boolean) => void;
  pricerData: PricerData | null;
  setPricerData: (data: PricerData | null) => void;
  role: string | null;
  setRole: (role: string) => void;
  addEvent: (event: any) => void;
  addArtist: (artist: any) => void;
  addProject: (project: any) => void;
}

const SharedContext = createContext<SharedState | undefined>(undefined);

export const useSharedContext = () => {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error('useSharedContext must be used within a SharedProvider');
  }
  return context;
};

export const SharedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPricerOpen, setIsPricerOpen] = useState(false);
  const [pricerData, setPricerData] = useState<PricerData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  const [state, setState] = useState<{
    events: any[];
    artists: any[];
    projects: any[];
  }>({
    events: [],
    artists: [],
    projects: [],
  });

  const addEvent = (event: any) => {
    setState((prevState) => ({
      ...prevState,
      events: [...prevState.events, event],
    }));
  };

  const addArtist = (artist: any) => {
    setState((prevState) => ({
      ...prevState,
      artists: [...prevState.artists, artist],
    }));
  };

  const addProject = (project: any) => {
    setState((prevState) => ({
      ...prevState,
      projects: [...prevState.projects, project],
    }));
  };

  return (
    <SharedContext.Provider value={{ 
      ...state, 
      isSearchOpen, 
      setIsSearchOpen, 
      isPricerOpen,
      setIsPricerOpen,
      pricerData,
      setPricerData,
      role,
      setRole,
      addEvent, 
      addArtist, 
      addProject 
    }}>
      {children}
    </SharedContext.Provider>
  );
};

