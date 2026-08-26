/**
 * ============================================================================
 * FILE: CatalogFilterSidebar.tsx
 * ============================================================================
 * 
 * @description Componente modular para el sidebar de filtros por categoría y precio.
 * 
 * @module Presentation/Components/Marketplace/Catalog/CatalogFilterSidebar
 * ============================================================================
 */

import React from 'react';

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  categoriesLoading: boolean;
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  priceRange: { min?: number; max?: number };
  onPriceChange: (range: { min?: number; max?: number }) => void;
  inStockOnly: boolean;
  onInStockChange: (val: boolean) => void;
};

export default function CatalogFilterSidebar({
  categories,
  categoriesLoading,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  inStockOnly,
  onInStockChange,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6">
      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-3">
          Categorías
        </h3>
        
        {categoriesLoading ? (
          <p className="text-xs text-gray-400">Cargando categorías...</p>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-3">
          Rango de Precio ($)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mínimo"
            value={priceRange.min || ''}
            onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-medium"
          />
          <input
            type="number"
            placeholder="Máximo"
            value={priceRange.max || ''}
            onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-medium"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span>Solo productos con stock disponible</span>
        </label>
      </div>
    </div>
  );
}
