/**
 * ============================================================================
 * FILE: SalesHeaderBanner.tsx
 * ============================================================================
 * 
 * @description Componente modular para el encabezado de analítica de ventas
 *              con selector de pestañas (Resumen, Sugerencias, Auditoría).
 * 
 * @module Presentation/Components/Sales/SalesHeaderBanner
 * ============================================================================
 */

import React from 'react';
import { ActiveTab, TimeRange } from '@/features/sales/hooks/useSalesAnalytics';

type Props = {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isDemoMode: boolean;
};

export default function SalesHeaderBanner({
  activeTab,
  onSelectTab,
  timeRange,
  onTimeRangeChange,
  isDemoMode,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
              Analítica de Ventas & Rendimiento
            </h1>
            {isDemoMode && (
              <span className="text-[10px] font-extrabold bg-purple-50 dark:bg-purple-950 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                Modo Demostración
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
            Monitorea ingresos, reputación de tu tienda y sugerencias de IA para potenciar tus ventas.
          </p>
        </div>

        {/* Filtro de Rango Temporal */}
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          className="py-2.5 px-4 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-extrabold cursor-pointer"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="month">Este Mes</option>
          <option value="year">Este Año</option>
        </select>
      </div>

      {/* Selector de Pestañas de Navegación */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 gap-6 pt-2">
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className={`pb-3 text-xs font-black transition relative ${
            activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800 dark:text-slate-400'
          }`}
        >
          📈 Resumen de Ventas
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('suggestions')}
          className={`pb-3 text-xs font-black transition relative ${
            activeTab === 'suggestions'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800 dark:text-slate-400'
          }`}
        >
          💡 Sugerencias de Optimización
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('audit')}
          className={`pb-3 text-xs font-black transition relative ${
            activeTab === 'audit'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800 dark:text-slate-400'
          }`}
        >
          ⭐ Auditoría de Calidad y Reseñas
        </button>
      </div>
    </div>
  );
}
