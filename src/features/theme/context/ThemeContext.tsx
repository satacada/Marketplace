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
export type FontFamilyOption = 'system' | 'amazon-clean' | 'modern-sans' | 'mono';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  iconPack: IconPackName;
  setIconPack: (pack: IconPackName) => void;
  fontFamily: FontFamilyOption;
  setFontFamily: (font: FontFamilyOption) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('modern-blue');
  const [iconPack, setIconPackState] = useState<IconPackName>('amazon-clean');
  const [fontFamily, setFontFamilyState] = useState<FontFamilyOption>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_color_theme') as ColorTheme | null;
    const savedPack = localStorage.getItem('app_icon_pack') as IconPackName | null;
    const savedFont = localStorage.getItem('app_font_family') as FontFamilyOption | null;

    if (savedTheme) setColorThemeState(savedTheme);
    if (savedPack) setIconPackState(savedPack);
    if (savedFont) setFontFamilyState(savedFont);
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

  const setFontFamily = (font: FontFamilyOption) => {
    setFontFamilyState(font);
    localStorage.setItem('app_font_family', font);
    document.documentElement.setAttribute('data-font', font);
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, iconPack, setIconPack, fontFamily, setFontFamily }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      colorTheme: 'modern-blue' as ColorTheme,
      setColorTheme: () => {},
      iconPack: 'amazon-clean' as IconPackName,
      setIconPack: () => {},
      fontFamily: 'system' as FontFamilyOption,
      setFontFamily: () => {},
    };
  }
  return context;
}
