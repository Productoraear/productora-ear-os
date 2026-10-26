'use client';

import * as React from 'react';

export type AppTheme = 'dark' | 'light' | 'airbnb';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  resolvedTheme: string;
  isAirbnb: boolean;
};

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  resolvedTheme: 'dark',
  isAirbnb: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<AppTheme>('dark');

  React.useEffect(() => {
    // 1. Prioridad: parámetro de URL (?theme=airbnb / ?theme=dark)
    const urlParams = new URLSearchParams(window.location.search);
    const queryTheme = urlParams.get('theme') as AppTheme | null;
    
    if (queryTheme === 'airbnb' || queryTheme === 'light' || queryTheme === 'dark') {
      setTheme(queryTheme);
      localStorage.setItem('ear_theme', queryTheme);
      applyTheme(queryTheme);
      return;
    }

    // 2. LocalStorage guardado
    const savedTheme = localStorage.getItem('ear_theme') as AppTheme | null;
    if (savedTheme === 'airbnb' || savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (t: AppTheme) => {
    const root = document.documentElement;
    if (t === 'airbnb') {
      root.classList.remove('dark');
      root.classList.add('light', 'theme-airbnb');
      root.setAttribute('data-theme', 'airbnb');
      root.style.colorScheme = 'light';
    } else if (t === 'light') {
      root.classList.remove('dark', 'theme-airbnb');
      root.classList.add('light');
      root.removeAttribute('data-theme');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light', 'theme-airbnb');
      root.classList.add('dark');
      root.removeAttribute('data-theme');
      root.style.colorScheme = 'dark';
    }
  };

  const handleSetTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('ear_theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => {
      const next: AppTheme = prev === 'dark' ? 'airbnb' : 'dark';
      localStorage.setItem('ear_theme', next);
      applyTheme(next);
      return next;
    });
  }, []);

  const isAirbnb = theme === 'airbnb';

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme, resolvedTheme: theme, isAirbnb }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeContext);
