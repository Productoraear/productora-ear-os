"use client";
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { translations } from '../locales/translations';

type Language = 'es'; // Solo español permitido

interface LanguageContextType {
  language: Language;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language] = useState<Language>('es');

  const t = useCallback((key: string): any => {
    try {
        const value = key.split('.').reduce((acc: any, cur: string) => acc && acc[cur], translations[language]);
        return value || key;
    } catch (e) {
        return key;
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};
