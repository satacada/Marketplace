/**
 * ============================================================================
 * FILE: page.tsx (dashboard/sales)
 * ============================================================================
 * 
 * @description Panel de Analítica de Ventas y Rendimiento para vendedores.
 *              Refactorizado bajo Clean Architecture, SOLID y SRP:
 *              - Lógica de negocio y métricas en `useSalesAnalytics`
 *              - Encabezados y filtros en `SalesHeaderBanner`
 *              - Tarjetas financieras en `SalesSummaryMetrics`
 * 
 * @module Presentation/Pages/Dashboard/Sales
 * ============================================================================
 */

'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useSalesAnalytics } from '@/features/sales/hooks/useSalesAnalytics';
import SalesHeaderBanner from '@/components/sales/SalesHeaderBanner';
import SalesSummaryMetrics from '@/components/sales/SalesSummaryMetrics';
import SalesSuggestionsTab from '@/components/sales/SalesSuggestionsTab';
import SellerReputationAuditTab from '@/components/sales/SellerReputationAuditTab';

export default function SalesAnalyticsPage() {
  const sales = useSalesAnalytics();

  if (sales.loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 font-bold text-sm">Cargando analítica de ventas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Encabezado y Pestañas */}
      <SalesHeaderBanner
        activeTab={sales.activeTab}
        onSelectTab={sales.setActiveTab}
        timeRange={sales.timeRange}
        onTimeRangeChange={sales.setTimeRange}
        isDemoMode={sales.isDemoMode}
      />

      {/* Tarjetas resumen de métricas */}
      <SalesSummaryMetrics
        summary={sales.summary}
        onOpenGoalModal={() => sales.setShowGoalModal(true)}
      />

      {/* Pestaña 1: Resumen de Ventas y Gráficos */}
      {sales.activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Gráfico simplificado de barras de ventas diarias */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
              Evolución Diaria de Ventas
            </h3>
            <div className="h-48 flex items-end justify-between gap-2 pt-6">
              {sales.dailySales.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition">
                    ${bar.revenue.toLocaleString('es-CL')}
                  </div>
                  <div className="w-full bg-blue-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div 
                      className="w-full bg-blue-600 group-hover:bg-blue-500 transition-all rounded-t-xl"
                      style={{ height: `${bar.heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-gray-500">{bar.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de Productos Más Vendidos */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
              Productos Destacados en Ventas
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-extrabold uppercase">
                    <th className="pb-3">Producto</th>
                    <th className="pb-3">Precio</th>
                    <th className="pb-3">Unidades Vendidas</th>
                    <th className="pb-3">Ingresos Totales</th>
                    <th className="pb-3">Stock Restante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-medium">
                  {sales.topProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 font-extrabold text-gray-900 dark:text-slate-100">{p.title}</td>
                      <td className="py-3 text-blue-600 font-bold">${p.price.toLocaleString('es-CL')}</td>
                      <td className="py-3 font-bold">{p.unitsSold} u.</td>
                      <td className="py-3 font-black text-emerald-600">${p.revenue.toLocaleString('es-CL')}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${p.stock > 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {p.stock} u.
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 2: Sugerencias de Optimización por IA */}
      {sales.activeTab === 'suggestions' && (
        <SalesSuggestionsTab topProducts={sales.topProducts} />
      )}

      {/* Pestaña 3: Auditoría de Calidad, Puntaje del Vendedor y Reseñas */}
      {sales.activeTab === 'audit' && (
        <SellerReputationAuditTab 
          avgRating={sales.summary.avgRating} 
          positivePercent={sales.summary.positiveRatingPercent} 
        />
      )}

      {/* Modal de edición de Meta Mensual */}
      {sales.showGoalModal && (
        <Modal
          isOpen={sales.showGoalModal}
          onClose={() => sales.setShowGoalModal(false)}
          title="Configurar Meta Mensual"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-600 dark:text-slate-300 font-medium">
              Ingresa el monto de facturación objetivo para este mes:
            </p>
            <input
              type="text"
              value={sales.newGoalInput}
              onChange={(e) => sales.setNewGoalInput(e.target.value)}
              className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-bold"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => sales.setShowGoalModal(false)}
                className="w-1/2 py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={sales.handleUpdateGoal}
                className="w-1/2 py-2.5 rounded-xl font-extrabold text-xs bg-blue-600 text-white"
              >
                Guardar Meta
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
