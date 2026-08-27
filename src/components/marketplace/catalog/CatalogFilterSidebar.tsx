/**
 * ============================================================================
 * FILE: CatalogFilterSidebar.tsx
 * ============================================================================
 * 
 * @description Panel lateral de Filtros estilo Facebook Marketplace (Imagen 1, 2 y 3):
 *              - Eliminada la sección redundante de Categorías (manejada arriba en Todos los departamentos ▾)
 *              - Todos los acordeones aparecen COLAPSADOS por defecto (sin desplegar)
 *              - Agregados los acordeones faltantes de Estado, Fecha de publicación y Disponibilidad
 * 
 * @module Presentation/Components/Marketplace/Catalog/CatalogFilterSidebar
 * ============================================================================
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { SortOption } from '@/features/products/types/product-filters.types';

type Props = {
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
  // Todos los acordeones colapsados por defecto (sin desplegar) según la Imagen 1 y 2
  const [openSections, setOpenSections] = useState({
    sort: false,
    price: false,
    condition: false,
    date: false,
    availability: false,
  });

  // Estados locales para los filtros visuales estilo Facebook Marketplace (Imagen 3)
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('available');

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCondition = (cond: string) => {
    if (selectedCondition.includes(cond)) {
      setSelectedCondition(selectedCondition.filter(c => c !== cond));
    } else {
      setSelectedCondition([...selectedCondition, cond]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4 text-gray-900 dark:text-slate-100">
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

        {/* Ubicación Resaltada (Imagen 1 y 2) */}
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

        {/* Acordeón 1: Ordenar por (Colapsado por defecto) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('sort')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Ordenar por</span>
            <span className="text-gray-400 text-xs">{openSections.sort ? '▲' : '▼'}</span>
          </button>

          {openSections.sort && (
            <div className="mt-2.5 space-y-1.5 pl-1 animate-fadeIn">
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

        {/* Acordeón 2: Precio ($) (Colapsado por defecto) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Precio ($)</span>
            <span className="text-gray-400 text-xs">{openSections.price ? '▲' : '▼'}</span>
          </button>

          {openSections.price && (
            <div className="mt-2.5 grid grid-cols-2 gap-2 animate-fadeIn">
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

        {/* Acordeón 3: Estado / Condición (Fiel a la Imagen 3) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('condition')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Estado</span>
            <span className="text-gray-400 text-xs">{openSections.condition ? '▲' : '▼'}</span>
          </button>

          {openSections.condition && (
            <div className="mt-2.5 space-y-1.5 pl-1 animate-fadeIn">
              {['Nuevo', 'Usado - Como nuevo', 'Usado - Buen estado', 'Usado - Aceptable'].map((cond) => (
                <label key={cond} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-slate-300 cursor-pointer hover:text-blue-600">
                  <input
                    type="checkbox"
                    checked={selectedCondition.includes(cond)}
                    onChange={() => toggleCondition(cond)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Acordeón 4: Fecha de publicación (Fiel a la Imagen 3) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('date')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Fecha de publicación</span>
            <span className="text-gray-400 text-xs">{openSections.date ? '▲' : '▼'}</span>
          </button>

          {openSections.date && (
            <div className="mt-2.5 space-y-1.5 pl-1 animate-fadeIn">
              {[
                { label: 'Todo', value: 'all' },
                { label: 'Últimas 24 horas', value: '24h' },
                { label: 'Últimos 7 días', value: '7d' },
                { label: 'Últimos 30 días', value: '30d' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-slate-300 cursor-pointer hover:text-blue-600">
                  <input
                    type="radio"
                    name="selectedDate"
                    checked={selectedDate === opt.value}
                    onChange={() => setSelectedDate(opt.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Acordeón 5: Disponibilidad (Fiel a la Imagen 3) */}
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => toggleSection('availability')}
            className="w-full flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <span>Disponibilidad</span>
            <span className="text-gray-400 text-xs">{openSections.availability ? '▲' : '▼'}</span>
          </button>

          {openSections.availability && (
            <div className="mt-2.5 space-y-1.5 pl-1 animate-fadeIn">
              {[
                { label: 'Disponibles', value: 'available' },
                { label: 'Vendidos', value: 'sold' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-slate-300 cursor-pointer hover:text-blue-600">
                  <input
                    type="radio"
                    name="selectedAvailability"
                    checked={selectedAvailability === opt.value}
                    onChange={() => {
                      setSelectedAvailability(opt.value);
                      onInStockChange(opt.value === 'available');
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Botón de Recomendados para ti */}
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
      </div>
    </div>
  );
}
