/**
 * ============================================================================
 * FILE: AmazonValueBadges.tsx
 * ============================================================================
 * 
 * @description Fila de 4 tarjetas de beneficios y garantías e-Commerce
 *              inspirada en la ficha técnica de Amazon.
 * 
 * @module Presentation/Components/Marketplace/Detail
 * ============================================================================
 */

'use client';

import React from 'react';
import AppIcon from '@/components/ui/icons/AppIcon';
import { useTheme } from '@/features/theme/context/ThemeContext';

export default function AmazonValueBadges() {
  const { iconPack } = useTheme();

  const badges = [
    {
      icon: 'shipping' as const,
      title: 'Envío Rápido',
      subtitle: 'Entregas en 24h a 48h con seguimiento en vivo.',
    },
    {
      icon: 'shield' as const,
      title: 'Garantía del Vendedor',
      subtitle: 'Producto 100% verificado y protegido.',
    },
    {
      icon: 'return' as const,
      title: 'Devolución Sencilla',
      subtitle: '30 días de garantía sin complicaciones.',
    },
    {
      icon: 'payment' as const,
      title: 'Pago Cifrado Seguros',
      subtitle: 'Transacción SSL protegida por Supabase.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200/90 dark:border-slate-800 shadow-2xs">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-gray-50/70 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AppIcon name={badge.icon} pack={iconPack} size="lg" />
            </div>
            <h4 className="text-xs font-black text-gray-900 dark:text-slate-100 mb-0.5">
              {badge.title}
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-snug">
              {badge.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
