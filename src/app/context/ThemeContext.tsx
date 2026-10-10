'use client';

import * as React from 'react';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  resolvedTheme: string;
};

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  resolvedTheme: 'dark'
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<string>('dark');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('ear_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (t: string) => {
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  };

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('ear_theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ear_theme', next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme, resolvedTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeContext);
