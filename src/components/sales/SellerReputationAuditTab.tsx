/**
 * ============================================================================
 * FILE: SellerReputationAuditTab.tsx
 * ============================================================================
 * 
 * @description Componente modular para la Pestaña "⭐ Auditoría de Calidad y Reseñas"
 *              del Dashboard de Ventas. Muestra el Puntaje del Vendedor y su Evolución
 *              en el Tiempo, desgloses de estrellas y métricas operativas de la tienda.
 * 
 * @module Presentation/Components/Sales/SellerReputationAuditTab
 * ============================================================================
 */

import React from 'react';

type Props = {
  avgRating: number;
  positivePercent: number;
};

export default function SellerReputationAuditTab({ avgRating, positivePercent }: Props) {
  // Evolución histórica del puntaje del vendedor en los últimos meses
  const scoreHistory = [
    { month: 'Mayo', score: 4.6, percent: 92 },
    { month: 'Junio', score: 4.7, percent: 94 },
    { month: 'Julio', score: 4.8, percent: 96 },
    { month: 'Agosto', score: 4.9, percent: positivePercent },
  ];

  const ratingBreakdown = [
    { stars: 5, label: '5 Estrellas', count: 48, percent: 88 },
    { stars: 4, label: '4 Estrellas', count: 4, percent: 8 },
    { stars: 3, label: '3 Estrellas', count: 1, percent: 3 },
    { stars: 2, label: '2 Estrellas', count: 1, percent: 1 },
    { stars: 1, label: '1 Estrella', count: 0, percent: 0 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-gray-900 dark:text-slate-100">
      {/* 1. Tarjeta Principal: Puntaje Actual y Tendencia de Evolución */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
            Reputación Global del Vendedor
          </span>
          <div className="text-4xl font-black text-amber-500 flex items-center justify-center gap-2">
            <span>⭐</span>
            <span>{avgRating.toFixed(1)}</span>
            <span className="text-base font-bold text-gray-400">/ 5.0</span>
          </div>
          <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            {positivePercent}% de compradores satisfechos
          </p>
          <span className="text-[11px] font-bold text-gray-500 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
            🏆 Vendedor Líder con Excelente Nivel de Servicio
          </span>
        </div>

        {/* Gráfico de Evolución del Puntaje en el Tiempo */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            📈 Evolución Histórica del Puntaje del Vendedor
          </h3>

          <div className="h-40 flex items-end justify-between gap-4 pt-4">
            {scoreHistory.map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                  {h.score.toFixed(1)} ⭐
                </span>
                <div className="w-full bg-blue-50 dark:bg-slate-800 rounded-t-2xl overflow-hidden h-28 flex items-end p-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl transition-all duration-500"
                    style={{ height: `${(h.score / 5.0) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-extrabold text-gray-500">{h.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Desglose por Estrellas y Métricas de Calidad Operativa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose de Estrellas */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            ⭐ Distribución de Calificaciones (Reseñas)
          </h3>
          <div className="space-y-2 pt-1">
            {ratingBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-3 text-xs">
                <span className="w-20 font-extrabold text-gray-600 dark:text-slate-400">{r.label}</span>
                <div className="flex-1 bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${r.percent}%` }}
                  />
                </div>
                <span className="w-10 text-right font-black text-gray-800 dark:text-slate-200">{r.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas Operativas de Excelencia */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            🚀 Indicadores de Servicio y Despacho
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-blue-50/60 dark:bg-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-700">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Tiempo de Respuesta</span>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">12 min</p>
              <span className="text-[10px] text-emerald-600 font-bold">⚡ Respuesta inmediata</span>
            </div>
            <div className="p-3.5 bg-emerald-50/60 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-slate-700">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Envíos a Tiempo</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">98.5%</p>
              <span className="text-[10px] text-emerald-600 font-bold">📦 Despacho puntual</span>
            </div>
            <div className="p-3.5 bg-purple-50/60 dark:bg-slate-800/60 rounded-2xl border border-purple-100 dark:border-slate-700">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Tasa de Reclamos</span>
              <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">0.2%</p>
              <span className="text-[10px] text-purple-600 font-bold">🛡️ Casi cero reclamos</span>
            </div>
            <div className="p-3.5 bg-amber-50/60 dark:bg-slate-800/60 rounded-2xl border border-amber-100 dark:border-slate-700">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Precisión en Fotos</span>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">99.1%</p>
              <span className="text-[10px] text-amber-600 font-bold">📷 Fiel a la publicación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
