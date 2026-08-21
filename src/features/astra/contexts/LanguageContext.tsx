"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'es';
    try {
      const saved = localStorage.getItem('astra-lang') as Language;
      if (saved && (saved === 'en' || saved === 'es')) return saved;
      const browserLang = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'es';
      return browserLang === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('astra-lang', lang);
      } catch (e) {
        console.warn('Failed to save language preference', e);
      }
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const t = (key: string, fallback?: string): string => {
    if (!key) return fallback || '';

    // Direct lookup or dot notation in current language
    const currentDict = translations[language] as any;
    let val = currentDict[key] ?? getNestedValue(currentDict, key);

    // Fallback to English
    if (val === undefined || val === null) {
      const enDict = translations.en as any;
      val = enDict[key] ?? getNestedValue(enDict, key);
    }

    if (typeof val === 'string') return val;
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = () => useContext(LanguageContext);
