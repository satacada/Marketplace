/**
 * ============================================================================
 * FILE: theme.config.ts
 * ============================================================================
 * @description Sistema de Diseño Centralizado & Design Tokens.
 *              Permite cambiar los colores, bordes, sombras y tipografías
 *              de toda la plataforma de forma modular en un solo archivo.
 * @module Shared/Theme
 */

export const THEME_CONFIG = {
  // Paleta de Colores Principal y Secundaria
  colors: {
    primary: {
      DEFAULT: '#2563eb', // Azul Moderno Marketplace
      hover: '#1d4ed8',
      active: '#1e40af',
      light: '#eff6ff',
      ring: '#bfdbfe',
    },
    success: {
      DEFAULT: '#059669', // Verde Esmeralda para Ítems en Carrito
      hover: '#047857',
      ring: '#a7f3d0',
      badge: '#065f46',
    },
    accent: {
      favorite: '#f43f5e', // Rosa/Rojo para Favoritos
      rating: '#eab308',   // Amarillo para Calificaciones
      shipping: '#22c55e', // Verde para Envío Gratis
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
    card: 'rounded-2xl',
    button: 'rounded-xl',
    pill: 'rounded-full',
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
