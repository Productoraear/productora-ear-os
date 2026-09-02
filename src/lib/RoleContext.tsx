"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'unassigned' | 'diplomat' | 'planner' | 'client' | 'provider' | 'artist' | 'cfo' | 'coo';

export type StitchBlueprint = 'luxury' | 'corporate' | 'cyberpunk' | 'vampire';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  blueprint: StitchBlueprint;
  setBlueprint: (blueprint: StitchBlueprint) => void;
  isReady: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('unassigned');
  const [blueprint, setBlueprintState] = useState<StitchBlueprint>('luxury');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('ear_os_role') as UserRole;
    if (savedRole && ['diplomat', 'planner', 'client', 'provider', 'artist'].includes(savedRole)) {
      setRoleState(savedRole);
    }
    
    const savedBlueprint = localStorage.getItem('ear_os_blueprint') as StitchBlueprint;
    if (savedBlueprint && ['luxury', 'corporate', 'cyberpunk', 'vampire'].includes(savedBlueprint)) {
      setBlueprintState(savedBlueprint);
    }
    
    setIsReady(true);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('ear_os_role', newRole);
  };

  const setBlueprint = (newBlueprint: StitchBlueprint) => {
    setBlueprintState(newBlueprint);
    localStorage.setItem('ear_os_blueprint', newBlueprint);
    
    // Optional: inject global classes based on blueprint directly into the <body> for instant CSS variable swaps
    document.body.className = `bg-[#050505] text-white antialiased font-sans theme-${newBlueprint}`;
  };

  return (
    <RoleContext.Provider value={{ role, setRole, blueprint, setBlueprint, isReady }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
