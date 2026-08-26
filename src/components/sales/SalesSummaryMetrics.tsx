/**
 * ============================================================================
 * FILE: SalesSummaryMetrics.tsx
 * ============================================================================
 * 
 * @description Componente modular para las tarjetas de métricas y resumen de ingresos.
 * 
 * @module Presentation/Components/Sales/SalesSummaryMetrics
 * ============================================================================
 */

import React from 'react';
import { SalesSummary } from '@/features/sales/hooks/useSalesAnalytics';

type Props = {
  summary: SalesSummary;
  onOpenGoalModal: () => void;
};

export default function SalesSummaryMetrics({ summary, onOpenGoalModal }: Props) {
  const goalProgress = Math.min(100, Math.round((summary.totalRevenue / summary.monthlyGoal) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Ingresos Totales */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
          <span>INGRESOS TOTALES</span>
          <span className="text-emerald-500">💰</span>
        </div>
        <div className="text-2xl font-black text-gray-900 dark:text-slate-100">
          ${summary.totalRevenue.toLocaleString('es-CL')}
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
          ↑ 12% vs periodo anterior
        </p>
      </div>

      {/* Progreso de Meta Mensual */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
          <span>META MENSUAL</span>
          <button
            type="button"
            onClick={onOpenGoalModal}
            className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Editar Meta
          </button>
        </div>
        <div className="text-2xl font-black text-gray-900 dark:text-slate-100">
          {goalProgress}%
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500" 
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>

      {/* Productos Vendidos */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
          <span>ÍTEMS VENDIDOS</span>
          <span className="text-blue-500">📦</span>
        </div>
        <div className="text-2xl font-black text-gray-900 dark:text-slate-100">
          {summary.itemsSold} unidades
        </div>
        <p className="text-[11px] text-gray-400 font-medium">
          En {summary.totalOrders} ordenes procesadas
        </p>
      </div>

      {/* Reputación del Vendedor */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
          <span>REPUTACIÓN TIENDA</span>
          <span className="text-amber-500">⭐</span>
        </div>
        <div className="text-2xl font-black text-gray-900 dark:text-slate-100">
          {summary.avgRating.toFixed(1)} / 5.0
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
          {summary.positiveRatingPercent}% de opiniones positivas
        </p>
      </div>
    </div>
  );
}
