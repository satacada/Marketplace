/**
 * ============================================================================
 * FILE: PublicationTypeStep.tsx
 * ============================================================================
 * 
 * @description Componente modular para el Paso 0 (Selector de Tipo de Publicación)
 *              al estilo Facebook Marketplace (Artículo, Vehículo, Propiedad).
 * 
 * @module Presentation/Components/Marketplace/Creation/PublicationTypeStep
 * ============================================================================
 */

import React from 'react';
import { PublicationType } from '@/features/products/hooks/useProductForm';

type Props = {
  categories: any[];
  onSelectType: (type: PublicationType) => void;
  onSetCategoryId: (catId: string) => void;
};

export default function PublicationTypeStep({ categories, onSelectType, onSetCategoryId }: Props) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full text-center space-y-3 mb-8">
        <span className="text-4xl">🛍️</span>
        <h1 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
          Crear publicación en Marketplace
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 font-medium max-w-lg mx-auto">
          Selecciona el tipo de anuncio que deseas publicar. Muestra tu artículo a miles de compradores en tu zona.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* Opción 1: Artículo en venta */}
        <button
          type="button"
          onClick={() => {
            onSelectType('article');
            if (categories.length > 0) onSetCategoryId(categories[0].id);
          }}
          className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-gray-200/90 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer active:scale-95"
        >
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
            📦
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 transition">
            Artículo en venta
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
            Crea una sola publicación para vender electrónica, ropa, herramientas, artículos de hogar o accesorios.
          </p>
        </button>

        {/* Opción 2: Vehículo en venta */}
        <button
          type="button"
          onClick={() => onSelectType('vehicle')}
          className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-gray-200/90 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer active:scale-95"
        >
          <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
            🚗
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 group-hover:text-indigo-600 transition">
            Vehículo en venta
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
            Vende un coche, camioneta, motocicleta u otro tipo de vehículo comercial o particular.
          </p>
        </button>

        {/* Opción 3: Propiedad en venta o alquiler */}
        <button
          type="button"
          onClick={() => onSelectType('property')}
          className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-gray-200/90 dark:border-slate-800 hover:border-purple-600 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer active:scale-95"
        >
          <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
            🏠
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 group-hover:text-purple-600 transition">
            Propiedad en venta/alquiler
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
            Muestra una vivienda, departamento, local comercial o terreno para venta o alquiler.
          </p>
        </button>
      </div>
    </div>
  );
}
