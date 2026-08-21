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
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, resolvedTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeContext);
