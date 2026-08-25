/**
 * ============================================================================
 * FILE: theme.config.ts
 * ============================================================================
 * @description Sistema de Diseño Centralizado & Design Tokens de Marketplace SaaS.
 *              Permite cambiar los colores, bordes, sombras, tipografías y contenedores
 *              de toda la plataforma de forma modular en un solo archivo.
 * @module Shared/Theme
 */

export const THEME_CONFIG = {
  // Paleta de Colores Principal y Secundaria
  colors: {
    primary: {
      DEFAULT: '#2563eb', // Azul Moderno Marketplace (Blue 600)
      hover: '#1d4ed8',   // Blue 700
      active: '#1e40af',  // Blue 800
      light: '#eff6ff',   // Blue 50
      border: '#bfdbfe',  // Blue 200
      text: '#1e40af',
    },
    seller: {
      DEFAULT: '#059669', // Verde Esmeralda Vendedor
      light: '#ecfdf5',
      border: '#a7f3d0',
      text: '#065f46',
    },
    admin: {
      DEFAULT: '#7c3aed', // Púrpura Admin
      light: '#f5f3ff',
      border: '#ddd6fe',
      text: '#5b21b6',
    },
    success: {
      DEFAULT: '#059669',
      hover: '#047857',
      ring: '#a7f3d0',
      badge: '#065f46',
    },
    danger: {
      DEFAULT: '#e11d48',
      light: '#fff1f2',
      border: '#fecdd3',
      text: '#9f1239',
    },
    accent: {
      favorite: '#f43f5e', // Rosa/Rojo para Favoritos
      rating: '#eab308',   // Amarillo para Calificaciones
      shipping: '#22c55e', // Verde para Envío
    },
    neutral: {
      background: '#f8fafc',
      card: '#ffffff',
      border: '#e2e8f0',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
    },
  },

  // Esquinas redondeadas modulares
  borderRadius: {
    card: 'rounded-3xl',
    container: 'rounded-2xl',
    button: 'rounded-xl',
    pill: 'rounded-full',
  },

  // Estilos de Jerarquía de Tipografía Centralizada
  typography: {
    pageTitle: 'text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100',
    pageSubtitle: 'text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 mt-1',
    sectionTitle: 'text-lg font-bold text-gray-900 dark:text-slate-100',
    cardTitle: 'text-sm font-bold text-gray-900 dark:text-slate-100',
    label: 'text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400',
  },

  // Contenedores de Sección Profesionales Adaptables (Estilo Amazon Seller Central / BestBuy / Shopify)
  sectionCards: {
    admin: 'bg-purple-50/70 dark:bg-purple-950/40 border-l-4 border-l-purple-600 border-y border-r border-purple-200/80 dark:border-purple-900/80 rounded-xl p-2.5 mb-3 shadow-2xs transition-colors',
    seller: 'bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-l-emerald-600 border-y border-r border-emerald-200/80 dark:border-emerald-900/80 rounded-xl p-2.5 mb-3 shadow-2xs transition-colors',
    account: 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600 border-y border-r border-blue-200/80 dark:border-blue-900/80 rounded-xl p-2.5 mb-3 shadow-2xs transition-colors',
  },

  // Badges y Títulos de Sección Ejecutivos
  badges: {
    admin: 'text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/60 border border-purple-200 dark:border-purple-800 font-black px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider',
    seller: 'text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 font-black px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider',
    account: 'text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 font-black px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider',
  },

  // Componentes de interfaz
  components: {
    productCard: {
      aspectRatio: 'h-40',
      grid: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5',
    },
    badgeCount: 'bg-emerald-800 text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs',
  },
};

export default THEME_CONFIG;
