/**
 * ============================================================================
 * FILE: ThemeContext.tsx
 * ============================================================================
 * 
 * @description Contexto de React y Custom Hook `useTheme` para gestionar el
 *              tema de color y el paquete de iconos del sistema globalmente.
 * 
 * @module Features/Theme/Context
 * ============================================================================
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IconPackName } from '@/components/ui/icons/iconPacks';

export type ColorTheme = 'modern-blue' | 'amazon' | 'emerald';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  iconPack: IconPackName;
  setIconPack: (pack: IconPackName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('modern-blue');
  const [iconPack, setIconPackState] = useState<IconPackName>('amazon-clean');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_color_theme') as ColorTheme | null;
    const savedPack = localStorage.getItem('app_icon_pack') as IconPackName | null;

    if (savedTheme) setColorThemeState(savedTheme);
    if (savedPack) setIconPackState(savedPack);
  }, []);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem('app_color_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const setIconPack = (pack: IconPackName) => {
    setIconPackState(pack);
    localStorage.setItem('app_icon_pack', pack);
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, iconPack, setIconPack }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback seguro si se invoca fuera del Provider
    return {
      colorTheme: 'modern-blue' as ColorTheme,
      setColorTheme: () => {},
      iconPack: 'amazon-clean' as IconPackName,
      setIconPack: () => {},
    };
  }
  return context;
}
