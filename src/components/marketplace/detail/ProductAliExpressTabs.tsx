/**
 * ============================================================================
 * FILE: ProductAliExpressTabs.tsx
 * ============================================================================
 * 
 * @description Pestañas de producto estilo AliExpress (Imagen 3):
 *              - Navegación por pestañas (Valoraciones, Detalles, Descripción, Tienda, Te podría interesar)
 *              - Reseñas con desglose por aspecto (Fácil instalación, Claridad, Durabilidad)
 *              - Filtros por foto, país, opiniones clave y fotos subidas por compradores.
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductAliExpressTabs
 * ============================================================================
 */

import React, { useState } from 'react';

type Props = {
  productTitle: string;
  description?: string | null;
};

export default function ProductAliExpressTabs({
  productTitle,
  description,
}: Props) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'details' | 'description' | 'store'>('reviews');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6 text-gray-900 dark:text-slate-100">
      {/* Navegación por Pestañas Estilo AliExpress (Imagen 3) */}
      <div className="flex items-center gap-6 border-b border-gray-100 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-black">
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 pb-2 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          <span>📍</span>
          <span>Valoraciones (1,745)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-2 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'details'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          Detalles
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('description')}
          className={`pb-2 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'description'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          Descripción
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('store')}
          className={`pb-2 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'store'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          Tienda
        </button>
      </div>

      {/* Contenido de Pestaña: Reseñas / Valoraciones Estilo AliExpress */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Header de Reseñas */}
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-black">Reseña | 4.8</h3>
            <div className="flex items-center text-amber-400 text-sm">
              ★★★★★
            </div>
            <span className="text-xs text-gray-500 font-bold">1,722 calificaciones</span>
            <span className="text-xs text-emerald-600 font-extrabold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              ✓ Todo desde compras verificadas
            </span>
          </div>

          {/* Barras de Desglose por Aspecto (Imagen 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Fácil instalación</span>
                <span className="text-blue-600">Excelente (94%)</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[94%]" />
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Claridad de instrucciones</span>
                <span className="text-blue-600">Muy claro (88%)</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[88%]" />
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Durabilidad</span>
                <span className="text-blue-600">Alta durabilidad (91%)</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[91%]" />
              </div>
            </div>
          </div>

          {/* Tags de Filtros de Opiniones (Imagen 3) */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-extrabold">
            <span className="px-3 py-1.5 bg-blue-600 text-white rounded-full">Todas las valoraciones ▾</span>
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-full cursor-pointer">📷 Con fotos (239)</span>
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-full cursor-pointer">🇦🇷 Argentina (142)</span>
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-full cursor-pointer">💬 Comentarios detallados (59)</span>
            <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full cursor-pointer">funciona bien (83)</span>
            <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full cursor-pointer">entrega rápida (80)</span>
          </div>
        </div>
      )}

      {/* Pestañas Secundarias */}
      {activeTab === 'details' && (
        <div className="space-y-2 text-xs font-medium text-gray-700 dark:text-slate-300">
          <p>• <strong>Producto:</strong> {productTitle}</p>
          <p>• <strong>Garantía:</strong> 12 meses oficial del fabricante</p>
          <p>• <strong>Envío:</strong> Despacho rápido en 24h a todo el país</p>
        </div>
      )}

      {activeTab === 'description' && (
        <div className="text-xs font-medium text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {description || 'Sin descripción adicional provista por el vendedor.'}
        </div>
      )}

      {activeTab === 'store' && (
        <div className="text-xs font-medium text-gray-700 dark:text-slate-300">
          <p>Vendedor oficial verificado en Marketplace SAAS.</p>
        </div>
      )}
    </div>
  );
}
