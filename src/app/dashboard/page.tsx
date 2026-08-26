/**
 * ============================================================================
 * FILE: page.tsx (app/dashboard)
 * ============================================================================
 * 
 * @description Vista del Panel Principal de Control (Dashboard).
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de resumen en `useDashboardOverview`
 *              - Vista limpia y desacoplada (< 100 líneas)
 * 
 * @module Presentation/Pages/Dashboard
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview';

export default function DashboardPage() {
  const dash = useDashboardOverview();

  if (dash.isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-500 font-bold text-sm">Cargando tu panel principal...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 text-gray-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
            ¡Hola, {dash.profile?.store_name || dash.user?.email || 'Usuario'}!
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Rol: <span className="font-extrabold capitalize">{dash.profile?.role || 'Comprador'}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={dash.logout}
          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/products" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-blue-500 transition space-y-2 block">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
            <span>MIS PRODUCTOS</span>
            <span>📦</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-slate-100">
            {dash.totalProductsCount} publicados
          </div>
          <p className="text-[11px] text-blue-600 font-bold">Gestionar catálogo →</p>
        </Link>

        <Link href="/dashboard/questions" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-blue-500 transition space-y-2 block">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
            <span>PREGUNTAS PENDIENTES</span>
            <span>💬</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-slate-100">
            {dash.pendingUnmutedCount} sin responder
          </div>
          <p className="text-[11px] text-blue-600 font-bold">Responder consultas →</p>
        </Link>

        <Link href="/dashboard/sales" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-blue-500 transition space-y-2 block">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
            <span>ANALÍTICA DE VENTAS</span>
            <span>📈</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-slate-100">
            Métricas & Reputación
          </div>
          <p className="text-[11px] text-blue-600 font-bold">Ver reporte completo →</p>
        </Link>
      </div>
    </div>
  );
}