/**
 * ============================================================================
 * FILE: GeoRadiusPicker.tsx
 * ============================================================================
 * 
 * @description Componente selector de radio GPS y filtro de velocidad de entrega
 *              (Same-Day Exprés < 2h, Retiro Hoy, Nacional).
 * 
 * @module Presentation/Components/Search/GeoRadiusPicker
 * ============================================================================
 */

'use client';

import React from 'react';
import AppIcon from '@/components/ui/icons/AppIcon';
import { useGeoLocationSearch, DeliveryTypeFilter } from '@/features/search/hooks/useGeoLocationSearch';

interface GeoRadiusPickerProps {
  onLocationChange?: (city: string, radiusKm: number) => void;
}

export default function GeoRadiusPicker({ onLocationChange }: GeoRadiusPickerProps) {
  const { userCity, radiusKm, updateRadius, deliveryFilter, updateDeliveryFilter } = useGeoLocationSearch();

  const radiusOptions = [
    { label: '1 km', value: 1 },
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '25 km', value: 25 },
    { label: 'Todo el país', value: 500 },
  ];

  const deliveryOptions: { label: string; value: DeliveryTypeFilter; icon: 'shipping' | 'store' | 'package' }[] = [
    { label: 'Todos', value: 'all', icon: 'package' },
    { label: '⚡ Exprés < 2h', value: 'express_2h', icon: 'shipping' },
    { label: '🏬 Retiro Hoy', value: 'pickup_today', icon: 'store' },
  ];

  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/90 dark:border-slate-800 space-y-3">
      {/* Ubicación y Radio GPS */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 dark:text-slate-100">
          <AppIcon name="location" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{userCity}</span>
        </div>

        <div className="flex items-center gap-1">
          {radiusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                updateRadius(opt.value);
                onLocationChange?.(userCity, opt.value);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                radiusKm === opt.value
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Despacho / Velocidad de Entrega */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800">
        <span className="text-[10px] font-extrabold uppercase text-gray-400 mr-1">Entrega:</span>
        {deliveryOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateDeliveryFilter(opt.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              deliveryFilter === opt.value
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <AppIcon name={opt.icon} className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
