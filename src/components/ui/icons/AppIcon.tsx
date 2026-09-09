/**
 * ============================================================================
 * FILE: AppIcon.tsx
 * ============================================================================
 * 
 * @description Componente unificado de icono configurable por temas.
 *              Soporta estilos SVG limpios (estilo Amazon / Heroicons) y Emoji.
 * 
 * @module Presentation/Components/UI/Icons
 * ============================================================================
 */

'use client';

import React from 'react';
import { IconName, IconPackName, EMOJI_MAP } from './iconPacks';

export interface AppIconProps {
  name: IconName;
  pack?: IconPackName;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES = {
  xs: 'w-3.5 h-3.5 text-[11px]',
  sm: 'w-4 h-4 text-xs',
  md: 'w-5 h-5 text-sm',
  lg: 'w-6 h-6 text-base',
  xl: 'w-8 h-8 text-xl',
};

export default function AppIcon({
  name,
  pack = 'amazon-clean',
  className = '',
  size = 'md',
}: AppIconProps) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (pack === 'emoji') {
    return <span className={`${className} inline-block select-none`}>{EMOJI_MAP[name] || '•'}</span>;
  }

  // Renderizado de iconos vectoriales limpios SVG (Amazon / Heroicons Style)
  switch (name) {
    case 'cart':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );

    case 'user':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case 'logout':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      );

    case 'search':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case 'store':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );

    case 'star':
      return (
        <svg className={`${sizeClass} ${className}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );

    case 'package':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );

    case 'location':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );

    case 'camera':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );

    case 'share':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );

    case 'heart':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );

    case 'heart-filled':
      return (
        <svg className={`${sizeClass} ${className}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );

    case 'shipping':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );

    case 'shield':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );

    case 'return':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      );

    case 'payment':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );

    case 'check':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    case 'filter':
      return (
        <svg className={`${sizeClass} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );

    default:
      return <span className={className}>{EMOJI_MAP[name] || '•'}</span>;
  }
}
