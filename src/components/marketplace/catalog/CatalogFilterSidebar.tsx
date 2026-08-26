/**
 * ============================================================================
 * FILE: CatalogFilterSidebar.tsx
 * ============================================================================
 * 
 * @description Panel lateral de Filtros estilo Facebook Marketplace (Imagen 4 y 5):
 *              - Ubicación GPS / Radio en km (Buenos Aires / Barracas)
 *              - Botón "✨ Recomendados para ti" debajo de categorías
 *              - Desplegables colapsables (Categorías, Ordenar por, Estado, Fecha, Disponibilidad)
 * 
 * @module Presentation/Components/Marketplace/Catalog/CatalogFilterSidebar
 * ============================================================================
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { SortOption } from '@/features/products/types/product-filters.types';

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
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  showRecommendations: boolean;
  onToggleRecommendations: () => void;
  locationName: string;
  radiusKm: number;
  onOpenLocationModal: () => void;
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
  sortBy,
  onSortChange,
  showRecommendations,
  onToggleRecommendations,
  locationName,
  radiusKm,
  onOpenLocationModal,
}: Props) {
  // Estados para acordeones desplegables (desplegados u ocultos al hacer clic)
  const [openSections, setOpenSections] = useState({
    categories: false,
    sort: true,
    price: true,
    condition: false,
    date: false,
    stock: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-5 text-gray-900 dark:text-slate-100">
      {/* Botón Estilo Facebook: + Crear publicación */}
      <Link
        href="/dashboard/products/new"
        className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800"
      >
        <span>➕</span>
        <span>Crear publicación</span>
      </Link>

      <div className="border-t border-gray-100 dark:border-slate-800 pt-3 space-y-4">
        <h3 className="text-sm font-black text-gray-900 dark:text-slate-100">
          Filtros
        </h3>

        {/* Sección de Ubicación Estilo Facebook Marketplace (Resaltado en amarillo en Imagen 5) */}
        <div className="p-3 bg-blue-50/50 dark:bg-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Ubicación
          </span>
          <div className="flex justify-between items-center">
            <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
              📍 {locationName} · {radiusKm} km
            </p>
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="text-[10px] font-bold text-gray-500 hover:text-blue-600 underline cursor-pointer"
            >
              Cambiar
            </button>
          </div>
        </div>

        {/* Acordeón 1: Ordenar por (Estilo Facebook) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('sort')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Ordenar por</span>
            <span>{openSections.sort ? '▲' : '▼'}</span>
          </button>

          {openSections.sort && (
            <div className="mt-2.5 space-y-1.5 pl-1">
              {[
                { label: 'Sugerencias', value: 'relevance' },
                { label: 'Fecha de publicación: más recientes', value: 'newest' },
                { label: 'Precio: más bajo', value: 'price_asc' },
                { label: 'Precio: más alto', value: 'price_desc' },
                { label: 'Mejor valorados', value: 'rating_desc' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-slate-300 cursor-pointer hover:text-blue-600">
                  <input
                    type="radio"
                    name="sortBy"
                    checked={sortBy === opt.value}
                    onChange={() => onSortChange(opt.value as SortOption)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Acordeón 2: Precio (Min a Max) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Precio ($)</span>
            <span>{openSections.price ? '▲' : '▼'}</span>
          </button>

          {openSections.price && (
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mín."
                value={priceRange.min || ''}
                onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full p-2 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 font-medium"
              />
              <input
                type="number"
                placeholder="Máx."
                value={priceRange.max || ''}
                onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full p-2 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 font-medium"
              />
            </div>
          )}
        </div>

        {/* Acordeón 3: Categorías (Se despliega únicamente al hacer clic en Imagen 2 y 4) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('categories')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Categorías {selectedCategory ? '(1 Seleccionada)' : ''}</span>
            <span>{openSections.categories ? '▲' : '▼'}</span>
          </button>

          {openSections.categories && (
            <div className="mt-2.5 space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
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
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón de Recomendados para ti debajo de Categorías (Indicado en Imagen 2) */}
        <button
          type="button"
          onClick={onToggleRecommendations}
          className={`w-full py-2.5 px-3 rounded-2xl font-extrabold text-xs transition border flex items-center justify-center gap-1.5 cursor-pointer ${
            showRecommendations
              ? 'bg-purple-600 text-white border-purple-500 shadow-purple-900/30'
              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-600 hover:text-white'
          }`}
        >
          <span>✨</span>
          <span>{showRecommendations ? 'Ocultar Recomendados' : 'Recomendados para ti'}</span>
        </button>

        {/* Acordeón 4: Disponibilidad / Stock */}
        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Mostrar sólo productos disponibles</span>
          </label>
        </div>
      </div>
    </div>
  );
}
