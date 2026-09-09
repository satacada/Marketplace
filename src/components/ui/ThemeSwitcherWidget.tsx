/**
 * ============================================================================
 * FILE: ThemeSwitcherWidget.tsx
 * ============================================================================
 * 
 * @description Selector flotante interactivo de temas visuales, fuentes y paquetes
 *              de iconos (estilo Linux Customizer / Amazon Switcher).
 * 
 * @module Presentation/Components/UI
 * ============================================================================
 */

'use client';

import React, { useState } from 'react';
import { useTheme, ColorTheme, FontFamilyOption } from '@/features/theme/context/ThemeContext';
import { IconPackName } from '@/components/ui/icons/iconPacks';
import AppIcon from './icons/AppIcon';

export default function ThemeSwitcherWidget() {
  const { colorTheme, setColorTheme, iconPack, setIconPack, fontFamily, setFontFamily } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
      {/* Botón Flotante de Configuración Visual */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center border-2 border-white transition hover:scale-105 cursor-pointer"
        title="Personalizar Tema, Iconos y Tipografía (Estilo Linux/Amazon)"
      >
        <AppIcon name="filter" size="lg" />
      </button>

      {/* Panel Flotante de Ajustes */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-4 animate-fadeIn text-gray-900 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <AppIcon name="store" size="sm" />
              <span>Personalizador Visual</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold px-2 py-0.5 rounded-md"
            >
              ✕
            </button>
          </div>

          {/* Selector 1: Pack de Iconos (Estilo Linux) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">
              📦 Set de Iconos Global:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['amazon-clean', 'heroicons', 'emoji'] as IconPackName[]).map((pack) => (
                <button
                  key={pack}
                  type="button"
                  onClick={() => setIconPack(pack)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition text-center capitalize ${
                    iconPack === pack
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                  }`}
                >
                  {pack === 'amazon-clean' ? 'Amazon' : pack}
                </button>
              ))}
            </div>
          </div>

          {/* Selector 2: Tipografía de Fuente */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">
              🔤 Fuente de Letra:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'amazon-clean', label: 'Amazon Ember' },
                  { id: 'modern-sans', label: 'Modern Sans' },
                  { id: 'system', label: 'System OS' },
                  { id: 'mono', label: 'Monospace' },
                ] as { id: FontFamilyOption; label: string }[]
              ).map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setFontFamily(font.id)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition text-center ${
                    fontFamily === font.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector 3: Tema de Color */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">
              🎨 Paleta de Colores:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'modern-blue', label: 'Modern Blue' },
                  { id: 'amazon', label: 'Amazon Navy' },
                  { id: 'emerald', label: 'Emerald' },
                ] as { id: ColorTheme; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setColorTheme(t.id)}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition text-center ${
                    colorTheme === t.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
