/**
 * ============================================================================
 * FILE: CatalogHeaderBanner.tsx
 * ============================================================================
 * 
 * @description Componente modular para el encabezado del catálogo con barra de búsqueda,
 *              autocompletado, selector de ordenamiento y toggle de recomendados a demanda.
 * 
 * @module Presentation/Components/Marketplace/Catalog/CatalogHeaderBanner
 * ============================================================================
 */

import React from 'react';
import { SortOption } from '@/features/products/types/product-filters.types';

type Props = {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  showRecommendations: boolean;
  onToggleRecommendations: () => void;
  onOpenVisualSearch: () => void;
  totalCount: number;
};

export default function CatalogHeaderBanner({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showRecommendations,
  onToggleRecommendations,
  onOpenVisualSearch,
  totalCount,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
      {/* Título y Acciones Superiores */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
            Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 font-medium">
            Explora productos verificados con envío rápido y seguridad garantizada ({totalCount} disponibles)
          </p>
        </div>

        {/* Botones de recomendados y búsqueda visual */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onToggleRecommendations}
            className={`px-3.5 py-2 rounded-full font-extrabold text-xs transition-all duration-200 shadow-2xs border flex items-center gap-1.5 cursor-pointer ${
              showRecommendations
                ? 'bg-purple-600 text-white border-purple-500 shadow-purple-900/30'
                : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-600 hover:text-white'
            }`}
            title="Ver productos sugeridos según tus preferencias"
          >
            <span>✨</span>
            <span>{showRecommendations ? 'Ocultar Recomendados' : 'Recomendados para ti'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenVisualSearch}
            className="px-3.5 py-2 rounded-full font-extrabold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            title="Buscar productos similares subiendo una foto"
          >
            <span>📷</span>
            <span>Buscar por Foto</span>
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda y Selector de Ordenamiento */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
        <div className="md:col-span-8 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, marca, modelo o palabra clave..."
            className="w-full pl-10 pr-4 py-3 text-xs border border-gray-300 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="md:col-span-4">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full py-3 px-4 text-xs border border-gray-300 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="newest">Más recientes primero</option>
            <option value="relevance">Mayor relevancia</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="rating_desc">Mejor valorados</option>
          </select>
        </div>
      </div>
    </div>
  );
}
