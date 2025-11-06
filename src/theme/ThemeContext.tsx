import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ColorValue } from 'react-native';
import { palette, gradients } from './colors';

export type ThemeMode = 'dark' | 'light';

type Theme = {
  mode: ThemeMode;
  palette: typeof palette;
  gradients: typeof gradients;
  toggleMode: () => void;
  surface: (variant?: 'base' | 'elevated') => {
    backgroundColor: ColorValue;
    borderColor: ColorValue;
  };
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  const toggleMode = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const value = useMemo<Theme>(() => {
    const isDark = mode === 'dark';
    const basePalette = isDark
      ? palette
      : {
          ...palette,
          background: '#f5f7fb',
          surface: '#ffffff',
          surfaceElevated: 'rgba(255,255,255,0.85)',
          textPrimary: '#111217',
          textMuted: '#404553',
        };

    return {
      mode,
      palette: basePalette,
      gradients,
      toggleMode,
      surface: (variant = 'base') => ({
        backgroundColor: variant === 'base' ? basePalette.surface : basePalette.surfaceElevated,
        borderColor: basePalette.border,
      }),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
