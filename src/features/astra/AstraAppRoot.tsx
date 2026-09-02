"use client";

import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';

export const AstraAppRoot: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="astra-suite-root w-full min-h-screen bg-[#050505] text-white">
        <App />
      </div>
    </LanguageProvider>
  );
};

export default AstraAppRoot;
