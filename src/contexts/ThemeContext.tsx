import { createContext, useContext, useState, type ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light', toggleMode: () => {} });

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('partem-theme') as ThemeMode) ?? 'light';
  });

  function toggleMode() {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('partem-theme', next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
