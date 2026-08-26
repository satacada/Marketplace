/**
 * ============================================================================
 * FILE: CatalogHeaderBanner.tsx
 * ============================================================================
 * 
 * @description Barra de búsqueda principal estilo Google (con botón de foto/lente 📷
 *              embebido a la derecha dentro del campo de texto) e integración limpia.
 * 
 * @module Presentation/Components/Marketplace/Catalog/CatalogHeaderBanner
 * ============================================================================
 */

import React from 'react';
import { SortOption } from '@/features/products/types/product-filters.types';

type Category = {
  id: string;
  name: string;
};

type Props = {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  onOpenVisualSearch: () => void;
  totalCount: number;
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
};

export default function CatalogHeaderBanner({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenVisualSearch,
  totalCount,
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Desplegable de Categoría Estilo Amazon ("Todos ▾") dentro de la barra */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory || ''}
            onChange={(e) => onSelectCategory(e.target.value ? e.target.value : null)}
            className="w-full sm:w-44 py-3 px-3.5 text-xs border border-gray-300 dark:border-slate-700 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-extrabold cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los departamentos</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Campo de Búsqueda Principal Estilo Google con Icono de Foto 📷 Embebido a la Derecha */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar en Marketplace (título, marca, modelo)..."
            className="w-full pl-10 pr-12 py-3 text-xs sm:text-sm border border-gray-300 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800/80 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition shadow-inner"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>

          {/* Botón de Lente / Búsqueda por Foto Embebido Estilo Google Lens */}
          <button
            type="button"
            onClick={onOpenVisualSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center transition border border-blue-200 dark:border-blue-800 cursor-pointer"
            title="Buscar con foto (Estilo Google Lens)"
          >
            <span className="text-sm">📷</span>
          </button>
        </div>
      </div>
    </div>
  );
}
